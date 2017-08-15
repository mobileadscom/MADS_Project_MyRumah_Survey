/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */
var mads = function(options) {

    var _this = this;

    this.render = options.render;

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* json */
    if (typeof json == 'undefined' && typeof rma != 'undefined') {
        this.json = rma.customize.json;
    } else if (typeof json != 'undefined') {
        this.json = json;
    } else {
        this.json = '';
    }

    /* fet */
    if (typeof fet == 'undefined' && typeof rma != 'undefined') {
        this.fet = typeof rma.fet == 'string' ? [rma.fet] : rma.fet;
    } else if (typeof fet != 'undefined') {
        this.fet = fet;
    } else {
        this.fet = [];
    }

    if (typeof pgId != 'undefined') {
        this.pgId = pgId;
    } else {
        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        this.pgId = _p8() + _p8(true) + _p8(true) + _p8();
    }

    this.fetTracked = false;

    /* load json for assets 
    this.loadJs(this.json, function() {
        _this.data = json_data;

        _this.render.render();
    });*/

    if (typeof preview != 'undefined') {
        window.addEventListener('message', function (e) {
            if (typeof e.data.auth != 'undefined' && e.data.auth == 'preview') {
                console.log(e.data.data)

                _this.data = e.data.data.data;
                _this.leadData = e.data.data.leadgen;
                _this.userId = e.data.data.userId;
                _this.studioId = e.data.data.studioId;
                setTimeout(function () {
                    _this.render.render();            
                },1)
            }
        })
        /*
        _this.data = preview.data;
        _this.leadData = preview.leadgen;
        _this.userId = preview.userId;
        _this.studioId = preview.studioId;
        setTimeout(function () {
            _this.render.render();            
        },1)
        */
    } else if (typeof md5 != 'undefined') {
        this.loadJs('https://cdn.richmediaads.com/studio-full/' + md5 + '.json?pgId=' + this.pgId, function () {
            _this.userId = data_studiofull.userId;
            _this.studioId = data_studiofull.id;
            _this.data = data_studiofull.tab1.componentContent[34].data.raw.property;
            console.log(data_studiofull.tab1.componentContent[34].data.raw)
            _this.leadData = data_studiofull.tab1.componentContent[34].data.raw.leadgen;
            _this.render.render();
        })
    } else {
        this.loadJs('data.json', function () {
            _this.userId = json_data.userId;
            _this.studioId = json_data.id;
            _this.data = json_data;
            _this.leadData = {
                leadGenEle : json_data.leadGenEle
            };
            _this.render.render();
        })
    }

    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* CT */
    if (typeof ct == 'undefined' && typeof rma != 'undefined') {
        this.ct = rma.ct;
    } else if (typeof ct != 'undefined') {
        this.ct = ct;
    } else {
        this.ct = [];
    }

    /* CTE */
    if (typeof cte == 'undefined' && typeof rma != 'undefined') {
        this.cte = rma.cte;
    } else if (typeof cte != 'undefined') {
        this.cte = cte;
    } else {
        this.cte = [];
    }

    /* tags */
    if (typeof tags == 'undefined' && typeof tags != 'undefined') {
        this.lead_tags = this.leadTagsProcess(rma.tags);
        this.tags = this.tagsProcess(rma.tags);
    } else if (typeof tags != 'undefined') {
        this.lead_tags = this.leadTagsProcess(tags);
        this.tags = this.tagsProcess(tags);
    } else {
        this.lead_tags = '';
        this.tags = '';
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];
    /* each engagement type should be track for only once and also the first tracker only */
    this.trackedEngagementType = [];
    /* trackers which should not have engagement type */
    this.engagementTypeExlude = [];
    /* first engagement */
    this.firstEngagementTracked = false;

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';

    /* Solve {2} issues */
    for (var i = 0; i < this.custTracker.length; i++) {
        if (this.custTracker[i].indexOf('{2}') != -1) {
            this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
        }
    }
};

/* Generate unique ID */
mads.prototype.uniqId = function() {

    return new Date().getTime();
}

mads.prototype.tagsProcess = function(tags) {

    var tagsStr = '';

    for (var obj in tags) {
        if (tags.hasOwnProperty(obj)) {
            tagsStr += '&' + obj + '=' + encodeURIComponent(tags[obj]);
        }
    }

    return tagsStr;
}

mads.prototype.leadTagsProcess = function (tags) {
    var tagsStr = '';

    for (var obj in tags) {
        if (tags.hasOwnProperty(obj)) {
            tagsStr += tags[obj] + ',';
        }
    }

    return tagsStr.slice(0, -1);
}

/* Link Opner */
mads.prototype.linkOpener = function(url) {

    if (typeof url != "undefined" && url != "") {

        if (typeof this.ct != 'undefined' && this.ct != '') {
            url = this.ct + encodeURIComponent(url);
        }

        if (typeof mraid !== 'undefined') {
            mraid.open(url);
        } else {
            window.open(url);
        }

        if (typeof this.cte != 'undefined' && this.cte != '') {
            this.imageTracker(this.cte);
        }
    }
}

/* tracker */
mads.prototype.tracker = function(tt, type, name, value) {
    /*
     * name is used to make sure that particular tracker is tracked for only once
     * there might have the same type in different location, so it will need the name to differentiate them
     */
    name = name || type;

    if (tt == 'E' && !this.fetTracked) {
        for (var i = 0; i < this.fet.length; i++) {
            var t = document.createElement('img');
            t.src = this.fet[i];

            t.style.display = 'none';
            this.bodyTag.appendChild(t);
        }
        this.fetTracked = true;
    }

    if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
        for (var i = 0; i < this.custTracker.length; i++) {

            if (i === 1 && name !== '1st_form_submitted') continue;

            var img = document.createElement('img');

            if (typeof value == 'undefined') {
                value = '';
            }

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{rmatype}}', type);
            src = src.replace('{{rmavalue}}', value);

            /* Insert TT's macro */
            if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
                src = src.replace('tt={{rmatt}}', '');
            } else {
                src = src.replace('{{rmatt}}', tt);
                this.trackedEngagementType.push(tt);
            }

            /* Append ty for first tracker only */
            if (!this.firstEngagementTracked && tt == 'E') {
                src = src + '&ty=E';
                this.firstEngagementTracked = true;
            }

            /* */
            img.src = src + this.tags + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

mads.prototype.imageTracker = function(url) {
    for (var i = 0; i < url.length; i++) {
        var t = document.createElement('img');
        t.src = url[i];

        t.style.display = 'none';
        this.bodyTag.appendChild(t);
    }
}

/* Load JS File */
mads.prototype.loadJs = function(js, callback) {
    var script = document.createElement('script');
    script.src = js;

    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function(href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
}

mads.prototype.styling = function (selector, styles) {
    var node = document.querySelector(selector);

    for (var s in styles) {
        console.log(s)
        console.log(styles[s])
        node.style[s] = styles[s];
    }
}

mads.prototype.extractBit = function(selector, content) {
    var e = {};
    var elems = content.querySelectorAll(selector);
    for (var elem in elems) {
        var id = elems[elem].id
        if (id) {
            Object.defineProperty(elems[elem], 'CSSText', {
                set: function(text) {
                    var pattern = /([\w-]*)\s*:\s*([^;]*)/g
                    var match, props = {}
                    while (match = pattern.exec(text)) {
                        props[match[1]] = match[2]
                        this.style[match[1]] = match[2]
                    }
                }
            })
            Object.defineProperty(elems[elem], 'ClickEvent', {
                set: function(f) {
                    this.addEventListener('click', f)
                }
            })
            elems[elem].fadeIn = function(duration) {
                duration = duration || 600
                var self = this
                self.CSSText = 'opacity:0;transition:opacity ' + (duration * 0.001) + 's;display:block;'
                setTimeout(function() {
                    self.CSSText = 'opacity:1;'
                }, 1)
            }
            elems[elem].fadeOut = function(duration) {
                duration = duration || 600
                var self = this
                self.CSSText = 'opacity:1;transition:opacity ' + (duration * 0.001) + 's;display:block;'
                setTimeout(function() {
                    self.CSSText = 'opacity:0;'
                    setTimeout(function() {
                        self.CSSText = 'display:none;'
                    }, duration)
                }, 1)
            }
            e[id] = elems[elem]
        }
    }

    return e
}

var leadgen = function (options) {
    this.app = options.app;
    var ele = '';
    var eles = options.elements;
    
    for (var i = 0; i < eles.length ; i++) {
        if (eles[i].ele_type == 'text' || eles[i].ele_type == 'number' || eles[i].ele_type == 'email') { 
            var r = eles[i].ele_required == '1' ? 'required' : '';
            ele += '<input type="' + eles[i].ele_type + '" class="lead_input" name="lead_' + i+ '" id="lead_' + i+ '" placeholder="' + eles[i].ele_placeholder + '" ' + r + '/>';
        } else if (eles[i].ele_type == 'dropdown') {
            ele += '<select name="lead_' + i+ '" id="lead_' + i+ '">';
            console.log(eles[i].ele_options)
            var o = eles[i].ele_options.split(",");
            console.log(o)
            for (var x = 0; x < o.length; x++) {
                ele += '<option>' + o[x] + '</option>'
            }
            ele += '</select>'
        }
    }

    document.querySelector(options.target).innerHTML = ele;
}
leadgen.prototype.getInputs = function () {

    var _this = this; 

    var inputs = []
    var elements = _this.app.leadData.leadGenEle.elements;
    var ele = '';
    for (var i = 0; i < elements.length; i++) {
        inputs[i] = document.querySelector('#lead_' + i).value;
    }
    return inputs; 
}
leadgen.prototype.submissionUrl = function () {

    var _this = this;

    var inputs = []
    var elements = _this.app.leadData.leadGenEle.elements;
    var ele = '';
    var email = _this.app.data.email;
    var trackId = 0;_this.app.leadData.leadGenTrackID;
    var userId = _this.app.userId;
    var studioId = _this.app.studioId;
    var tabId = 1;
    var referredURL = _this.app.lead_tags;
    console.log(_this.app.leadData)
    console.log(trackId)
    for (var i = 0; i < elements.length; i++) {
        inputs[i] = document.querySelector('#lead_' + i).value;
        ele += '{%22fieldname%22:%22' + elements[i].ele_name + '%22,%22value%22:%22' + inputs[i] + '%22}';

        if (i != elements.length - 1) {
            ele += ',';
        }
    }

    var url = 'https://www.mobileads.com/api/save_lf?contactEmail=' + email + '&gotDatas=1&element=[' + ele + ']&user-id=' + userId + '&studio-id=' + studioId + '&tab-id=1&trackid=' + trackId + '&referredURL=' + referredURL+ '&callback=leadGenCallback'

    return url;
}

var ad = function() {
    this.app = new mads({
        'render': this
    });

    document.body.style.padding = 0
    document.body.style.margin = 0

    this.app.loadCss(this.app.path + 'css/style.css')

    this.submitted = false;
}

ad.prototype.render = function() {

    var _this = this; 

    var content = this.app.contentTag;
    var path = this.app.path;

    content.innerHTML = '<div>\
    <div id="first" style=""></div>\
    <div id="second">' + this.questions() + '</div>\
    <div id="third">\
    <form id="form"><div id="formInputs"></div><button type="submit" id="submitBtn"></button></form>\
    <div id="submit"></div>\
    <img id="loading" src="' + this.app.data.load + '"/>\
    </div>\
    <div id="forth" style=""></div>\
    </div>';

    this.app.styling('#first',{
        'background' : 'url(' + this.app.data.start_bg + ')'
    })

    this.app.styling('#second',{
        'background' : 'url(' + this.app.data.q_bg + ')'
    })

    this.app.styling('#third',{
        'background' : 'url(' + this.app.data.form_bg + ')'
    })

    this.app.styling('#forth',{
        'background' : 'url(' + this.app.data.end_bg + ')'
    })

    this.app.styling('#submit',{
        'background' : 'url(' + this.app.data.submit + ')'
    })

    this.app.styling('#submitBtn',{
        'display' : 'none'
    })

    this.progressImage = ['', this.app.data.q_bg1,this.app.data.q_bg2,this.app.data.q_bg3,this.app.data.q_bg4,this.app.data.q_bg5,this.app.data.q_bg6,this.app.data.q_bg7]

    this.images = [];
    for (var x = 1; x <= this.progressImage.length; x++) {
        (new Image).src = this.progressImage[x];
        this.images[x] = new Image();
        this.images[x].src = this.progressImage[x];
    }

    _this.leadgen = new leadgen({
        target : '#formInputs',
        elements : _this.app.leadData.leadGenEle.elements,
        app : _this.app
    })
    
    this.eles = this.app.extractBit('div, img, button, form, input, select', content);

    this.events();
}

ad.prototype.questions = function () {
    var i = 1;

    var questions = '';

    while (typeof this.app.data['q' + i] != 'undefined' && this.app.data['q' + i] != '') {

        var a = this.app.data['a' + i].split(',');
        var answers = '';
        for (var x = 0; x < a.length; x++) {
            var t = x + 1;
            answers += '<div><label><input type="radio" name="q' + i + '" value="a' + t + '"/>' + a[x] + '</label></div>';
        }

        questions += '<div id="question_' + i + '" class="question"><div>' + this.app.data['q' + i] + '</div><div>' + answers + '</div></div>';

        i++;
    }

    return questions;
}

ad.prototype.events = function () {
    console.log(this.eles.first)
    var _this = this;
    this.eles.first.addEventListener('click', function () {
        _this.app.tracker('E', 'start')
        _this.eles.second.fadeIn();
        _this.eles.question_1.fadeIn();
    })

    var radios = document.querySelectorAll('input[type=radio]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].addEventListener('click', function () {
            //console.log(event.target.name)
            //console.log(event.target.value)

            _this.app.tracker('E', event.target.name + event.target.value)
            console.log(event.target.name[1])
            console.log(_this.progressImage[event.target.name[1]])
            if (event.target.parentElement.parentElement.parentElement.parentElement.nextSibling != null) {
                _this.eles[event.target.parentElement.parentElement.parentElement.parentElement.id].fadeOut();
                _this.eles[event.target.parentElement.parentElement.parentElement.parentElement.nextSibling.id].fadeIn();

                //_this.eles.second.style.background = 'url(' + _this.progressImage[event.target.name[1]] + ')';
                _this.eles.second.style.background = 'url(' + _this.images[event.target.name[1]].src + ')';
            } else {
                _this.eles.second.fadeOut();
                _this.eles.third.fadeIn();
            }
        })
    }

    this.eles.submit.addEventListener('click', function () {
        _this.eles.submitBtn.click();
    })

    this.eles.form.addEventListener('submit', function (event) {

        event.preventDefault();

        if (!this.submitted) {
            this.submitted = true;

            _this.app.tracker('E', 'submit')
            console.log('submit')
            console.log(_this.leadgen.submissionUrl())

            _this.eles.submit.fadeOut();
            _this.eles.loading.fadeIn();



            _this.app.loadJs(_this.leadgen.submissionUrl())
        }

        return false;
    })
}

ad.prototype.submitCallback = function () {
    this.eles.third.fadeOut();
    this.eles.forth.fadeIn();
}

var myrumah = new ad();

/* leadgen callback */
function leadGenCallback(obj) {
    myrumah.submitCallback();
}