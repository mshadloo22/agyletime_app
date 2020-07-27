<!DOCTYPE html>

@yield('htmltag', '<html>')

<head>
    <title>
        @section('title')
        Agyle Time -
        @show
    </title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    @yield('stylesheets')

    <!--[if lt IE 9]>
    <script src="https://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <script>
    var _rollbarConfig = {
        accessToken: "2141d05c614a46dcbc64f80e9f6697a9",
        captureUncaught: true,
        payload: {
            environment: "{{ App::environment() }}"
        }
    };
    !function(a,b){function c(b){this.shimId=++h,this.notifier=null,this.parentShim=b,this.logger=function(){},a.console&&void 0===a.console.shimId&&(this.logger=a.console.log)}function d(b,c,d){a._rollbarWrappedError&&(d[4]||(d[4]=a._rollbarWrappedError),d[5]||(d[5]=a._rollbarWrappedError._rollbarContext),a._rollbarWrappedError=null),b.uncaughtError.apply(b,d),c&&c.apply(a,d)}function e(b){var d=c;return g(function(){if(this.notifier)return this.notifier[b].apply(this.notifier,arguments);var c=this,e="scope"===b;e&&(c=new d(this));var f=Array.prototype.slice.call(arguments,0),g={shim:c,method:b,args:f,ts:new Date};return a._rollbarShimQueue.push(g),e?c:void 0})}function f(a,b){if(b.hasOwnProperty&&b.hasOwnProperty("addEventListener")){var c=b.addEventListener;b.addEventListener=function(b,d,e){c.call(this,b,a.wrap(d),e)};var d=b.removeEventListener;b.removeEventListener=function(a,b,c){d.call(this,a,b&&b._wrapped?b._wrapped:b,c)}}}function g(a,b){return b=b||this.logger,function(){try{return a.apply(this,arguments)}catch(c){b("Rollbar internal error:",c)}}}var h=0;c.init=function(a,b){var e=b.globalAlias||"Rollbar";if("object"==typeof a[e])return a[e];a._rollbarShimQueue=[],a._rollbarWrappedError=null,b=b||{};var h=new c;return g(function(){if(h.configure(b),b.captureUncaught){var c=a.onerror;a.onerror=function(){var a=Array.prototype.slice.call(arguments,0);d(h,c,a)};var g,i,j="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(g=0;g<j.length;++g)i=j[g],a[i]&&a[i].prototype&&f(h,a[i].prototype)}return a[e]=h,h},h.logger)()},c.prototype.loadFull=function(a,b,c,d){var e=g(function(){var a=b.createElement("script"),e=b.getElementsByTagName("script")[0];a.src=d.rollbarJsUrl,a.async=!c,a.onload=f,e.parentNode.insertBefore(a,e)},this.logger),f=g(function(){if(void 0===a._rollbarPayloadQueue)for(var b,c,d,e,f=new Error("rollbar.js did not load");b=a._rollbarShimQueue.shift();)for(d=b.args,e=0;e<d.length;++e)if(c=d[e],"function"==typeof c){c(f);break}},this.logger);g(function(){c?e():a.addEventListener?a.addEventListener("load",e,!1):a.attachEvent("onload",e)},this.logger)()},c.prototype.wrap=function(b,c){try{var d;if(c&&(d="function"==typeof c?c:function(){return c}),"function"!=typeof b)return b;if(b._isWrap)return b;if(!b._wrapped){b._wrapped=function(){try{return b.apply(this,arguments)}catch(c){throw d&&(c._rollbarContext=d()),a._rollbarWrappedError=c,c}},b._wrapped._isWrap=!0;for(var e in b)b.hasOwnProperty(e)&&(b._wrapped[e]=b[e])}return b._wrapped}catch(f){return b}};for(var i="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError".split(","),j=0;j<i.length;++j)c.prototype[i[j]]=e(i[j]);var k="//d37gvrvc0wt4s1.cloudfront.net/js/v1.1/rollbar.min.js";_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||k;var l=c.init(a,_rollbarConfig);l.loadFull(a,b,!1,_rollbarConfig)}(window,document);
    </script>

</head>
<body style="background-attachment: fixed;">
    @if(Auth::check())
    @include('partials/navbar')
    @endif

    @if(Session::has('flash_notice'))
    <div class="alert alert-success alert-dismissable alert-fadeout">
        <button class="close" data-dismiss="alert">&times;</button>
        {{ Session::get('flash_notice') }}
    </div>
    @endif

    @if (Session::has('flash_error'))
    <div class="alert alert-danger alert-dismissable alert-fadeout">
        <button class="close" data-dismiss="alert">&times;</button>
        {{ Session::get('flash_error') }}
    </div>
    @endif

    @if(false)
    @if(Auth::check())
    @if(Helper::wizardProgress()['total'] < 100 && Route::getCurrentRoute()->getPath() != 'setup_wizard')
    <div class="row progress-bar-container" style="position:absolute;">
        <div class="col-md-4 col-md-offset-8">
            <h3>Your profile is {{ $progress = Helper::wizardProgress()['total'] }}% complete.</h3>
            <div class="progress progress-striped">
                <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="{{ $progress }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ $progress }}%;">
                </div>
            </div>
            <p>Click <a href="{{ route(Helper::wizardProgress()['next_step']['route']) }}">here</a> to {{ Helper::wizardProgress()['next_step']['message'] }}</p>
        </div>
    </div>
    @endif
    @endif
    @endif

    @yield('content')
    <div class="modal fade" id="suggestionModal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Make a Suggestion/Report an Error</h4>
                </div>
                <form class="form-horizontal" action="{{ URL::route('suggestion', array(), false) }}" method="POST">
                    <div class="modal-body">

                        <div class="form-group">
                            <label class="col-sm-4 control-label" for="suggestionType">Contact Type:</label>
                            <div class="col-md-8">
                                <select name="suggestionType" id="suggestionType" class="form-control">
                                    <option value="suggestion">Feature Suggestion</option>
                                    <option value="error">Report an Error</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-4 control-label" for="suggestionNotes">Details:</label>
                            <div class="col-md-8">
                                <textarea name="suggestionNotes" class="form-control" id="suggestionNotes" rows="3"></textarea>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <!-- Error Modal template -->
    <script id="errorModal" type="text/html">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                    <h3 data-bind="text:header"></h3>
                </div>
                <div class="modal-body">
                    <h4 data-bind="text:body"></h4>
                    <br />
                    <p>Code: <span data-bind="text:error_code"></span></p>
                    <p>Message: <span data-bind="text:error_message"></span></p>
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn" data-bind="click:close">Close</a>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </script>
    <div data-bind="bootstrapErrorModal:error_modal" data-keyboard="false" data-backdrop="static"></div>

    @yield('javascripts')
    <script>
//        $('#suggestionModalButton').click(function() {
//            $('#suggestionModal').modal('show');
//        });

        window.setTimeout(function() {
            $(".alert-fadeout").fadeTo(500, 0).slideUp(500, function(){
                $(this).remove();
            });
        }, 5000);
    </script>
    @if(Auth::check() && Auth::user()->tour_state != 'finished' && Route::getCurrentRoute()->getPath() != 'setup_wizard')
    <script type="text/javascript">
        // Initialize the tour
        $.getJSON("tour/tour-step", function(data) {
            setTimeout(function() {
                tour.init();
                if(tour.getCurrentStep() !== data.data.tour_state*1) {
                    tour.goTo(data.data.tour_state*1);
                }
                tour.start();
            }, 2000);

        });
    </script>
    @endif
</body>
</html>