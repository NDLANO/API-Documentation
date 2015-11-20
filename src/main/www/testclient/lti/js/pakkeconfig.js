LMS = {};

LMS.setupLocalStorage = function(){
    if(localStorage.getItem("lti-providers") == null){
        localStorage.setItem("lti-providers", "add-lti-provider");
    }
    localStorage.setItem("add-lti-provider/launchUrl", "add-lti-provider.html");
};

LMS.getLtiProviders = function(callback){
    $.ajax({
        url: "http://localhost:8080/packages/lti/providers",
        dataType: "json",
        success: function(data) {
            ltiProviders = data;
            callback(data);
        }
    });
};

LMS.addLtiProvider = function(config){
    $("#lti-content-selector").css("visibility", "hidden");
    localStorage.setItem(config.title + "/launchUrl", config.launch_url);
    localStorage.setItem("lti-providers", localStorage.getItem("lti-providers") + ";" + config.title);
};

LMS.addContent = function(content){
    console.log("content to add: " + content.url);
    $("#lti-content-selector").css("visibility", "hidden");
    content.url = decodeURIComponent(content.url);
    LMS.addSlide($("#slideshow-container"), content);
};

LMS.launchLtiProvider = function(provider){
    var ltiWindow = $("<iframe>")
        .attr("width", "100%")
        .attr("height", "90%")
        .attr("id", "lti-provider-window");

    $("#lti-provider-window").replaceWith(ltiWindow);
    if(LMS.ltiProviders[provider] == null){
        console.log("LTI provider " + provider + " was not found :(");
        return false;
    }
    var launchUrl = LMS.ltiProviders[provider].launch_url;
    var form = $("<form>").attr("action", launchUrl).attr("method", "post")
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "lti_message_type")
            .attr("value", "basic-lti-launch-request"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "lti_version")
            .attr("value", "LTI-1p1"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "roles")
            .attr("value", "Instructor"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "ext_content_return_url")
            .attr("value", "http://api.test.ndla.no/testclient/lti/embedcontent.html"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "ext_content_return_types")
            .attr("value", "oembed,lti_launch_url,url,image_url"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "ext_content_intended_use")
            .attr("value", "embed"));

    ltiWindow.contents().find("body").append(form);
    form.submit();
};

LMS.init = function(){
    LMS.updateLtiProvidersSelector($("#lti-provider-selector"));
    Slideshow.prepareSlideshow($("#slideshow-container"));
    $("#lti-provider-selector").get().pop().selectedIndex = -1;
    var messageDispatcher = {};
    messageDispatcher["embedcontent.html"] = LMS.addContent;
    window.addEventListener("message", function(event){
        message = event;
        var source = event.data.source;
        source = source.substr(source.lastIndexOf("/") + 1);
        if(messageDispatcher[source] != null){
            messageDispatcher[source].call(this, event.data.payload);
        } else {
            console.log("no event handler for " + source + " found");
        }
    }, false);
};

LMS.updateLtiProvidersSelector = function(selector){
    LMS.getLtiProviders(function(ltiProviders){
        selector.empty();
        LMS.ltiProviders = ltiProviders;
        for(var ltiProvider in ltiProviders){
            $("#lti-provider-selector").append(
                $("<option>")
                    .attr("value", ltiProvider)
                    .append(ltiProvider));
        }
        selector.get().pop().selectedIndex = -1;
    });
};

LMS.addSlideButtonClicked = function(element){
    $("#lti-content-selector").css("visibility", "visible");
};

LMS.ltiProviderSelected = function(selector){
    var selectedLti = selector.selectedOptions[0].value;
    LMS.launchLtiProvider(selectedLti);
};
