var inherits = require('inherits');
var ListView = require('streamhub-sdk/views/list-view');
var View = require('view');
var Auth = require('auth');

'use strict';

/**
 * A view that displays a content item's replies
 * @param [opts] {Object}
 * @param [opts.content] {Content} The content item to be displayed
 * @param [opts.maxNestLevel] {int} The maximum level of nesting for replies
 * @param [opts.nestLevel] {int} The current nest level
 * @param [opts.contentViewFactory] {ContentViewFactory} A factory to create
 *        ContentViews for the root and reply content
 * @param [opts.queueInitial] {number} The number of items to display before
 *        being held by queue.
 */
var ContentRepliesView = function (opts) {
    opts = opts || {};

    if (! opts.content) {
        throw 'Expected opts.content when constructing ContentRepliesView';
    }

    View.call(this, opts);

    opts.autoRender = false;
    this._maxNestLevel = Math.max(0, opts.maxNestLevel);
    this._nestLevel = opts.nestLevel;
    this._maxVisibleItems = opts.maxVisibleItems;
    this._showVisibleItemsAtHead = !!opts.order.showVisibleItemsAtHead;
    this._showQueueHeader = this._showVisibleItemsAtHead;

    this.content = opts.content;
    this._contentViewFactory = opts.contentViewFactory;
    this._order = opts.order;
    this.comparator = opts.order.comparator;

    this._queueInitial = opts.queueInitial;
    this._listView = new ListView({
        comparator: this.comparator,
        autoRender: true,
        showMoreButton: opts.showMoreButton,
        showQueueButton: opts.showQueueButton,
        initial: this._maxVisibleItems,
        queueInitial: this._queueInitial
    });

    this.content.on('reply', function (reply) {
        this._onReply(reply);
    }.bind(this));
};
inherits(ContentRepliesView, View);

ContentRepliesView.prototype.elClass = 'lf-thread-replies';

ContentRepliesView.prototype.events = View.prototype.events.extended({
    'showMore.hub': function (e) {
        e.stopPropagation();
        if ($(e.target).hasClass(ListView.prototype.showMoreElClass)) {
            this._listView.showMoreButton.setCount(this.content.replies.length - this._listView.more.getSize());
        } else if ($(e.target).hasClass(ListView.prototype.showQueueElClass)) {
            this._listView.showQueueButton.setCount(this._listView.queue.getSize());
        }
    }
});

/**
 * Handler of the 'reply' event emitted by a Content instance
 * @param reply {Content} The content item representing the reply being added
 */
ContentRepliesView.prototype._onReply = function (reply) {
    var button,
        buttonStream,
        pushToButtonStream,
        replyView;
    if (this._isReplyAdded(reply)) {
        return;
    }
    if (this.comparator === ListView.prototype.comparators.CREATEDAT_ASCENDING) {
        button = this._listView.showMoreButton;
        buttonStream = this._listView.more;
        pushToButtonStream = this.pushMore;
    } else {
        button = this._listView.showQueueButton;
        buttonStream = this._listView.queue;
        pushToButtonStream = this.pushQueue;
    }

    replyView = this._createReplyView(reply);
    if (this._isContentByAuthor(reply)) {
        this._listView.add(replyView);
        return;
    }
    pushToButtonStream.call(this, replyView);
    button.setCount(buttonStream.getSize());
};

ContentRepliesView.prototype._isReplyAdded = function (reply) {
    if (reply.id && this._contentPosted && this._contentPosted.author.id === reply.author.id) {
        return true;
    }
    return false;
};

/**
 * Checks whether a Content's author is the same as the user currently
 * authenticated
 * @param content {Content} The content instance to check the author against the
 *      authenticated user
 * @return {boolean} Whether the content's author is the same as the
 *      authenticated user
 */
ContentRepliesView.prototype._isContentByAuthor = function (content) {
    return content.author && content.author.id === (Auth.get('livefyre') && Auth.get('livefyre').get('id'));
};

/**
 * Insert reply view at back of more stream
 * @param replyView {ContentView} The reply view to be held in more stream
 */
ContentRepliesView.prototype.pushMore = function (replyView) {
    this._listView.more.write(replyView);
};

/**
 * Insert reply view at back of queue stream
 * @param replyView {ContentView} The reply view to be held in the queue stream
 */
ContentRepliesView.prototype.pushQueue = function (replyView) {
    this._listView.queue.write(replyView);
};

/**
 * Insert a set of replies
 * @param replies {Array.<Content>} The set of replies to add to the view
 */
ContentRepliesView.prototype._addReplies = function (replies) {
    replies = replies || [];
    replies.sort(this.comparator);

    if (!this._showQueueHeader) {
        for (var i=replies.length-1; i > -1; i--) {
            var reply = replies[i];
            this.pushMore(this._createReplyView(reply));
        }
    } else {
        for (var i=0; i < replies.length; i++) {
            var reply = replies[i];
            this.pushMore(this._createReplyView(reply));
        }
    }
    this._listView.showMoreButton.setCount(this.content.replies.length - this._maxVisibleItems);
};

/**
 * Create a reply view from a Content instance representing a reply
 * @param content {Content} A Content instance representing a reply
 * @return {ContentThreadView}
 */
ContentRepliesView.prototype._createReplyView = function (content) {
    var ContentThreadView = require('thread');

    return new ContentThreadView({
        content: content,
        maxNestLevel: this._maxNestLevel,
        nestLevel: this._nestLevel,
        order: this._order,
        isRoot: false,
        contentViewFactory: this._contentViewFactory,
        maxVisibleItems: this._maxVisibleItems,
        queueInitial: this._queueInitial
    });
};

ContentRepliesView.prototype.getReplyView = function (reply) {
    for (var i=0; i < this._listView.views.length; i++) {
        var replyView = this._listView.views[i];
        if (replyView.content === reply) {
            return replyView;
        }
    }
};

ContentRepliesView.prototype.render = function () {
    this._listView.setElement(this.$el);
    this._listView.render();
    this._addReplies(this.content.replies);
};

module.exports = ContentRepliesView;
