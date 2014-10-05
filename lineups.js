;( function ( $ ) {

  var Lineup = function(selector, option) {
    this.lineupID = _.uniqueId('lineup-');
    this.option = {
      resize: true,
      onBeforeRefresh: function() {},
      onAfterRefresh: function() {}
    };
    this.init.apply(this, arguments);
    return this;
  };

  Lineup.prototype = {
    constructor: Lineup,
    init: function(selector, option) {
      this.option = $.extend({}, this.option, option);
      this.el = $(selector);
      if (this.el.length > 0) {
        this.refresh();
        this._eventify();
      }
      return this;
    },
    reset: function() {
      this.el.css('height', '');
      return this;
    },
    refresh: function() {
      var that = this;
      var rows = {};

      that.option.onBeforeRefresh();

      that.reset();

      // 同じoffset.topのグループを作る
      _.each(that.el, function(item, idx) {
        var $item = $(item);
        var offset_top = $item.offset().top;
        rows["r"+offset_top] = rows["r"+offset_top] || [];
        rows["r"+offset_top].push({
          el: $item,
          height: $item.height()
        });
      });
      // グループごとに最大の高さを求めて、高さをそろえる
      _.each(rows, function(row, idx) {
        if (row.length===1) {
          return;
        }
        var max = _.max(row, function(col){
          return col.height;
        }).height;
        _.each(row, function(col, idx) {
          $(col.el).height(max);
        });
      });

      that.option.onAfterRefresh();

      return this;
    },
    destroy: function() {
      this.reset();
      $(window).off("resize."+this.lineupID);
    },
    _eventify: function() {
      if (this.option.resize) {
        $(window).on("resize."+this.lineupID, $.proxy(this.refresh, this));
      }
      return this;
    }
  };


  //@description Lineupをまとめて管理する
  //@usage:
  //new Lineups([
  //  '.fuga',
  //  {el:'.hoge',option:{}}
  //]);
  var Lineups = function(selectors, global_option) {
    this.global_option = global_option || undefined;
    this.items = [];
    this.init.apply(this, arguments);
    return this;
  };

  Lineups.prototype.init = function(targets){
    var that = this;
    _.each(targets, function(target){
      that.add(target);
    });
    return this;
  };

  //@description 高さを揃えたい要素を追加する
  //@usage
  // lineups.add('.hoge');
  // lineups.add({el:'.hoge',option:{}});
  Lineups.prototype.add = function(target){
    var that = this;
    var lineup;
    if (_.isString(target)) {
      lineup = new Lineup(target, that.global_option);
    } else {
      //個別のオプションがあればそれを使用する
      //なければ全体用オプションを使用する
      lineup = new Lineup(target.el, target.option || that.global_option || {});
    }
    that.items.push(lineup);
    return this;
  };

  //@description すべてのlineupを更新する
  Lineups.prototype.refreshAll = function(){
    _.each(this.items, function(lineup){
      lineup.refresh();
    });
    return this;
  };

  //@description heightをautoにする
  Lineups.prototype.resetAll = function(){
    _.each(this.items, function(lineup){
      lineup.reset();
    });
    return this;
  };

  //@description 貼ったイベントなどを削除する
  Lineups.prototype.destroyAll = function(){
    _.each(this.items, function(lineup){
      lineup.destroy();
    });
    return this;
  };

  window.Lineups = Lineups;

} )( jQuery );
