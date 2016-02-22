import React, { Component } from 'react';
import Fetch from '../utils/fetch/fetch';
import lodash from 'lodash';
import jQuery from 'jquery';


class Handler{
    constructor(obj){
        this.currentStep = obj.state.data.id;
        this.data = obj.state.data.payload;
        this.props = obj.props;
        this.fbData = "";
        this.stored = obj.state.data.stored;
        this.phoneColors = obj.state.data.phoneColors;
        this.token = obj.state.data.token;
        this.locationId = obj.state.data.locationId;
        this.justData = obj.state.data;
        //this.locationId = obj.state.data.locationId;

        //this.token = obj.state.data
        if( obj.state.data.id == 1){
            this.fbData = obj.state.data.chosenFromFbOptions;
        }else{
            this.fbData = obj.state.data.fbData;
        }
    }
    updateStorage(sourceId,data){
        let currentDataStr = localStorage.getItem("state");
        let storageData = JSON.parse(currentDataStr);
        if(storageData === null){
            storageData = {};
        }
        storageData["page_"+sourceId] = JSON.stringify(data);
        localStorage.setItem("state", JSON.stringify(storageData));

    }
    goToNextUrl(stepId){
        let url="";
        switch(stepId){
            case 0:
                url = {nextStepId: 1, nextStepUri: "/step1"};
                break;
            case 1:
                url = {nextStepId: 2,nextStepUri: "/step2"};
                break;
            case 2:
                url={nextStepId: 3, nextStepUri: "/step3"};
                break;
            case 3:
                url={nextStepId: 4, nextStepUri: "/step4"};
                break;
            case 4:
                url={nextStepId: 5,nextStepUri:"https://qa.keeprz.com/?location_id="+this.locationId+"&location_version=0&token="+this.fbData.link};
                break;
        }
        let _self = this;
        jQuery(".pageWrap").animate({left:"-100%"},"slow", function(){
            _self.props.history.pushState(null, url.nextStepUri);
        });
    }
    stayOnPage(stepId, errorObj,data){
        //debugger;
        let url="";
        switch(stepId){
            case 0:
                url = "/?a="+errorObj.statusCode+"&email="+data.email+"&store="+data.store;
                break;
        }
        //this.props.history.pushState(null, url);
        window.location.href= url;
    }
    handleData(){
        let error = false;
        let sendData = {};
        let returnData = {};
        if(typeof this.currentStep == "undefined"){
            return;
        }
            let _self = this;
            switch(this.currentStep){

                case 0:
                    let store = this.data.store ? this.data.store.value : "";
                    let email = this.data.email ? this.data.email.value : "";

                    //sendData = {server: 3, displayName: store, email: email, phone: '089364452', phone_prefix: 972, app_lang: 1, timezone:247, ref:'diy'};
                    sendData = {server: 3, displayName: store, email: email, app_lang: 1, phone_prefix: 1, timezone:'', ref:'diy'};
                            return Fetch
                                //.post('https://www.keeprz.com/api/private/public/Register', {apiPrefix:"",dataType:"",data: sendData})
                                .post('https://qa.keeprz.com/api/private/public/Register', {apiPrefix:"",dataType:"",data: sendData})
                                .then((response)=> {
                                    console.log(response);
                                    if(response.statusCode != "user_created"){

                                        /*TBD WHAT TO DO OF USE NOT CREATED*/

                                       _self.stayOnPage(this.currentStep,response,{"email":email,"store":store});
                                    }else {
                                        console.log("page 0 response:");
                                        console.log(response);
                                        _self.updateStorage(this.currentStep, {
                                            store: this.data.store.value,
                                            email: this.data.email.value,
                                            userId: response.user_id,
                                            locationId: response.location_id,
                                            token: response.token,
                                            groupId: response.group_id
                                        });
                                        _self.goToNextUrl(this.currentStep);
                                    }
                                });
                    break;
                case 1:

                    let fbLink = this.fbData.link;
                    let token = this.token;
                    let locationId = this.locationId;
                    let fetchedData = {fbData:{}, fbThemes:{}, defaultThemes:{}};
                   // debugger;
                    fetchedData.fbData = {data:{name:this.data.businessName.value,link:fbLink,category:this.data.category,about:this.data.info,website:this.data.website}};
                    fetchedData.defaultThemes = {"status":"success","data":[{"uipack_id":"33813","constant_id":"33813","uipack_name":"0","location_id":"4323","locationColor":"0","negativeLocationColor":"0","backgroundImageOverlayColor":"0","tileBackgroundColorFrom":"0","tileBackgroundColorTo":"0","tileInnerBackgroundColor":"0","pageHeaderBackgroundColorFrom":"0","pageHeaderBackgroundColorTo":"0","pageHeaderTextColor":"0","tileHeaderTextColor":"0","textColor":"0","listBackgroundColor":"0","listItemBackgroundColor":"0","tileBackgroundColor":"0","fontPrimary":"0","fontPrimaryBold":"0","brightness":"bright","active":"1","source":null,"public":"0","version":"0"},{"uipack_id":"294","constant_id":"0","uipack_name":"Bright Vanity Fair","location_id":null,"locationColor":"rgba(98, 191, 122, 1)","negativeLocationColor":"rgba(255, 255, 255, 1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(177, 206, 207, 0.85)","tileBackgroundColorTo":"rgba(212, 224, 224, 0.7)","tileInnerBackgroundColor":"rgba(208, 37, 82, 0.15)","pageHeaderBackgroundColorFrom":"rgba(177, 206, 207, 0.85)","pageHeaderBackgroundColorTo":"rgba(212, 224, 224, 0.7)","pageHeaderTextColor":"rgba(68, 68, 68, 1)","tileHeaderTextColor":"rgba(208, 37, 82, 1)","textColor":"rgba(68, 68, 68, 1)","listBackgroundColor":"rgba(212, 224, 224, 0.4)","listItemBackgroundColor":"rgba(255, 255, 255, 0.48)","tileBackgroundColor":"rgba(212, 224, 224, 0.45)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":null,"public":"1","version":"0"},{"uipack_id":"295","constant_id":"0","uipack_name":"Dark Chinatown","location_id":null,"locationColor":"rgba(220, 62, 38, 1)","negativeLocationColor":"rgba(255, 255, 255, 1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(35,43,43,0.832)","tileBackgroundColorTo":"rgba(35,43,43,0.576)","tileInnerBackgroundColor":"rgba(140,149,148,0.128)","pageHeaderBackgroundColorFrom":"rgba(255,255,255,0.576)","pageHeaderBackgroundColorTo":"rgba(255,255,255,0.576)","pageHeaderTextColor":"rgba(255, 255, 255, 1)","tileHeaderTextColor":"rgba(227,174,86,1)","textColor":"rgba(255, 255, 255, 1)","listBackgroundColor":"rgba(220,62,38,0.256)","listItemBackgroundColor":"rgba(35,43,43,0.576)","tileBackgroundColor":"rgba(35,43,43,0.512)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":null,"public":"1","version":"0"},{"uipack_id":"296","constant_id":"0","uipack_name":"Dark Ocean","location_id":null,"locationColor":"rgba(78,177,186,1)","negativeLocationColor":"rgba(255, 255, 255, 1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(34,41,48,0.832)","tileBackgroundColorTo":"rgba(34,41,48,0.576)","tileInnerBackgroundColor":"rgba(233,233,233,0.128)","pageHeaderBackgroundColorFrom":"rgba(34,41,48,0.832)","pageHeaderBackgroundColorTo":"rgba(34,41,48,0.832)","pageHeaderTextColor":"rgba(233,233,233,1)","tileHeaderTextColor":"rgba(78,177,186,1)","textColor":"rgba(233,233,233,1)","listBackgroundColor":"rgba(78,177,186,0.256)","listItemBackgroundColor":"rgba(34,41,48,0.68)","tileBackgroundColor":"rgba(34,41,48,0.512)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":null,"public":"1","version":"0"},{"uipack_id":"297","constant_id":"0","uipack_name":"Bright Floral","location_id":null,"locationColor":"rgba(137,54,103,1)","negativeLocationColor":"rgba(245,244,235,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(245,244,235,0.79)","tileBackgroundColorTo":"rgba(245,244,235,0.748)","tileInnerBackgroundColor":"rgba(171,182,106,0.128)","pageHeaderBackgroundColorFrom":"rgba(245,244,235,0.952)","pageHeaderBackgroundColorTo":"rgba(245,244,235,0.74)","pageHeaderTextColor":"rgba(67,78,60,1)","tileHeaderTextColor":"rgba(137,54,103,1)","textColor":"rgba(67,78,60,1)","listBackgroundColor":" rgba(137,54,103,0.256)","listItemBackgroundColor":"rgba(245,244,235,0.748)","tileBackgroundColor":"rgba(245,244,235,0.576)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":null,"public":"1","version":"0"},{"uipack_id":"298","constant_id":"0","uipack_name":"Bright Orange","location_id":null,"locationColor":"rgba(219, 88, 0, 1)","negativeLocationColor":"rgba(255, 255, 255, 1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(255, 255, 255, 0.9)","tileBackgroundColorTo":"rgba(255, 255, 255, 0.7)","tileInnerBackgroundColor":"rgba(219, 88, 0, 0.15)","pageHeaderBackgroundColorFrom":"rgba(255, 255, 255, 0.6)","pageHeaderBackgroundColorTo":"rgba(255, 255, 255, 0.6)","pageHeaderTextColor":"rgba(64, 64, 64, 1)","tileHeaderTextColor":"rgba(219, 88, 0, 1)","textColor":"rgba(64, 64, 64, 1)","listBackgroundColor":"rgba(219, 88, 0, 0.3)","listItemBackgroundColor":"rgba(255, 255, 255, 0.8)","tileBackgroundColor":"rgba(255, 255, 255, 0.5)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":null,"public":"1","version":"0"},{"uipack_id":"309","constant_id":"0","uipack_name":"Bright Blues","location_id":null,"locationColor":"rgba(39,150,255, 1)","negativeLocationColor":"rgba(255, 255, 255, 1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(255, 255, 255, 0.9)","tileBackgroundColorTo":"rgba(255, 255, 255, 0.7)","tileInnerBackgroundColor":"rgba(39,150,255, 0.15)","pageHeaderBackgroundColorFrom":"rgba(255, 255, 255, 0.6)","pageHeaderBackgroundColorTo":"rgba(255, 255, 255, 0.6)","pageHeaderTextColor":"rgba(64, 64, 64, 1)","tileHeaderTextColor":"rgba(39,150,255, 1)","textColor":"rgba(64, 64, 64, 1)","listBackgroundColor":"rgba(39,150,255, 0.3)","listItemBackgroundColor":"rgba(255, 255, 255, 0.8)","tileBackgroundColor":"rgba(255, 255, 255, 0.5)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":null,"public":"1","version":"0"},{"uipack_id":"7434","constant_id":"0","uipack_name":"Bright Spring","location_id":null,"locationColor":"rgba(96,151,82,225)","negativeLocationColor":"rgba(255,255,255,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(255,255,255,0.79)","tileBackgroundColorTo":"rgba(255,255,255,0.47)","tileInnerBackgroundColor":"rgba(46,66,45,0.1)","pageHeaderBackgroundColorFrom":"rgba(255,255,255,0.57)","pageHeaderBackgroundColorTo":"rgba(255,255,255,0.53)","pageHeaderTextColor":"rgba(64,64,64,255)","tileHeaderTextColor":"rgba(64,64,64,255)","textColor":"rgba(64,64,64,255)","listBackgroundColor":"rgba(255,255,255,0.21)","listItemBackgroundColor":"rgba(255,255,255,0.46)","tileBackgroundColor":"rgba(255,255,255,0.47)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"7436","constant_id":"0","uipack_name":"","location_id":null,"locationColor":"rgba(201,0,0,1)","negativeLocationColor":"rgba(255,255,255,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(0,0,0,0.7)","tileBackgroundColorTo":"rgba(0,0,0,0.51)","tileInnerBackgroundColor":"rgba(144,144,144,0.2)","pageHeaderBackgroundColorFrom":"rgba(0,0,0,0.63)","pageHeaderBackgroundColorTo":"rgba(80, 80, 80, 0.44)","pageHeaderTextColor":"rgba(255,255,255,1)","tileHeaderTextColor":"rgba(255,255,255,1)","textColor":"rgba(255,255,255,1)","listBackgroundColor":"rgba(0, 0, 0, 0.05)","listItemBackgroundColor":"rgba(0,0,0,0.49)","tileBackgroundColor":"rgba(0,0,0,0.52)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"7437","constant_id":"0","uipack_name":"","location_id":null,"locationColor":"rgba(160,136,102,1)","negativeLocationColor":"rgba(66,65,83,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(66,65,83,1)","tileBackgroundColorTo":"rgba(116,115,133,0.7)","tileInnerBackgroundColor":"rgba(51,44,33,0.67)","pageHeaderBackgroundColorFrom":"rgba(170,168,191,0.7)","pageHeaderBackgroundColorTo":"rgba(116,115,133,0.7)","pageHeaderTextColor":"rgba(227,227,227,1)","tileHeaderTextColor":"rgba(160,136,102,1)","textColor":"rgba(227,227,227,1)","listBackgroundColor":"rgba(160,136,102,0.79)","listItemBackgroundColor":"rgba(116,115,133,0.7)","tileBackgroundColor":"rgba(116,115,133,0.7)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"7438","constant_id":"0","uipack_name":"","location_id":null,"locationColor":"rgba(158,188,147,1)","negativeLocationColor":"rgba(255,255,255,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(255,255,255,1)","tileBackgroundColorTo":"rgba(255,255,255,0.78)","tileInnerBackgroundColor":"rgba(195,174,120,0.56)","pageHeaderBackgroundColorFrom":"rgba(195,179,122,0.88)","pageHeaderBackgroundColorTo":"rgba(195,170,122,0.7)","pageHeaderTextColor":"rgba(0,0,0,1)","tileHeaderTextColor":"rgba(147,188,151,1)","textColor":"rgba(0,0,0,1)","listBackgroundColor":"rgba(147,186,188,0.1)","listItemBackgroundColor":"rgba(255,255,255,0.74)","tileBackgroundColor":"rgba(255,255,255,0.51)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"7439","constant_id":"0","uipack_name":"","location_id":null,"locationColor":"rgba(255,39,117,1)","negativeLocationColor":"rgba(255, 255, 255, 1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(255, 255, 255, 0.9)","tileBackgroundColorTo":"rgba(255, 255, 255, 0.7)","tileInnerBackgroundColor":"rgba(255,39,117,0.15)","pageHeaderBackgroundColorFrom":"rgba(255, 255, 255, 0.6)","pageHeaderBackgroundColorTo":"rgba(255, 255, 255, 0.6)","pageHeaderTextColor":"rgba(64, 64, 64, 1)","tileHeaderTextColor":"rgba(204,0,74,1)","textColor":"rgba(64, 64, 64, 1)","listBackgroundColor":"rgba(255,233,39,0.3)","listItemBackgroundColor":"rgba(255, 255, 255, 0.8)","tileBackgroundColor":"rgba(255, 255, 255, 0.5)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"7441","constant_id":"0","uipack_name":"","location_id":null,"locationColor":"rgba(248,255,173,1)","negativeLocationColor":"rgba(163,112,112,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(163,112,112,0.76)","tileBackgroundColorTo":"rgba(163,112,112,0.76)","tileInnerBackgroundColor":"rgba(163,112,112,0.76)","pageHeaderBackgroundColorFrom":"rgba(163,112,112,0.76)","pageHeaderBackgroundColorTo":"rgba(163,112,112,0.76)","pageHeaderTextColor":"rgba(255,255,255,1)","tileHeaderTextColor":"rgba(248,255,173,1)","textColor":"rgba(255,255,255,1)","listBackgroundColor":"rgba(255,227,82,0.24)","listItemBackgroundColor":"rgba(163,112,112,0.76)","tileBackgroundColor":"rgba(163,112,112,0.76)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"7448","constant_id":"0","uipack_name":"","location_id":null,"locationColor":"rgba(50,50,50,1)","negativeLocationColor":"rgba(255,255,255,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(0,0,0,0.99)","tileBackgroundColorTo":"rgba(0,0,0,0.99)","tileInnerBackgroundColor":"rgba(0,0,0,1)","pageHeaderBackgroundColorFrom":"rgba(0,0,0,1)","pageHeaderBackgroundColorTo":"rgba(0,0,0,1)","pageHeaderTextColor":"rgba(255,255,255,1)","tileHeaderTextColor":"rgba(194,155,155,0.7)","textColor":"rgba(255,255,255,1)","listBackgroundColor":"rgba(209,134,134,0.5)","listItemBackgroundColor":"rgba(0,0,0,0.7)","tileBackgroundColor":"rgba(0,0,0,0.8)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"14680","constant_id":"0","uipack_name":"Lost and Found","location_id":"0","locationColor":"rgba(255,230,0,1)","negativeLocationColor":"rgba(84,39,51,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(198,213,205,0.85)","tileBackgroundColorTo":"rgba(198,213,205,0.85)","tileInnerBackgroundColor":"rgba(90,106,98,0.64)","pageHeaderBackgroundColorFrom":"rgba(84,39,51,1)","pageHeaderBackgroundColorTo":"rgba(84,39,51,1)","pageHeaderTextColor":"rgba(233,76,111,1)","tileHeaderTextColor":"rgba(233,76,111,1)","textColor":"rgba(84,39,51,1)","listBackgroundColor":"rgba(255,230,0,1)","listItemBackgroundColor":"rgba(198,213,205,1)","tileBackgroundColor":"rgba(90,106,98,0.81)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"14681","constant_id":"0","uipack_name":"Romantic Vintage","location_id":"0","locationColor":"rgba(217,78,103,1)","negativeLocationColor":"rgba(242,216,167,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(242,216,167,0.85)","tileBackgroundColorTo":"rgba(242,216,167,0.67)","tileInnerBackgroundColor":"rgba(166,133,114,0.55)","pageHeaderBackgroundColorFrom":"rgba(242,216,167,0.85)","pageHeaderBackgroundColorTo":"rgba(242,216,167,0.73)","pageHeaderTextColor":"rgba(217,78,103,1)","tileHeaderTextColor":"rgba(89,39,35,1)","textColor":"rgba(115,80,60,1)","listBackgroundColor":"rgba(217,78,103,1)","listItemBackgroundColor":"rgba(242,216,167,0.85)","tileBackgroundColor":"rgba(166,133,114,0.91)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"14682","constant_id":"0","uipack_name":"Papua New Guinea","location_id":"0","locationColor":"rgba(191,175,128,1)","negativeLocationColor":"rgba(89,50,60,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(38,1,38,0.9)","tileBackgroundColorTo":"rgba(38,1,38,0.83)","tileInnerBackgroundColor":"rgba(140,105,84,0.95)","pageHeaderBackgroundColorFrom":"rgba(89,50,60,1)","pageHeaderBackgroundColorTo":"rgba(89,50,60,1)","pageHeaderTextColor":"rgba(242,238,179,1)","tileHeaderTextColor":"rgba(242,238,179,1)","textColor":"rgba(191,175,128,1)","listBackgroundColor":"rgba(242,238,179,1)","listItemBackgroundColor":"rgba(38,1,38,0.9)","tileBackgroundColor":"rgba(38,1,38,0.9)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"7771","constant_id":"0","uipack_name":"","location_id":"0","locationColor":"rgba(0,0,0,1)","negativeLocationColor":"rgba(255,215,115,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(200,228,205,1)","tileBackgroundColorTo":"rgba(148,195,167,0.78)","tileInnerBackgroundColor":"rgba(0,190,171,0.43)","pageHeaderBackgroundColorFrom":"rgba(200,228,205,1)","pageHeaderBackgroundColorTo":"rgba(148,195,167,0.78)","pageHeaderTextColor":"rgba(0,0,0,1)","tileHeaderTextColor":"rgba(174,67,99,1)","textColor":"rgba(0,0,0,1)","listBackgroundColor":"rgba(255,89,105,1)","listItemBackgroundColor":"rgba(255,255,255,0.74)","tileBackgroundColor":"rgba(0,190,171,0.79)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"7772","constant_id":"0","uipack_name":"Facebook","location_id":"0","locationColor":"rgba(153,194,182,1)","negativeLocationColor":"rgba(104,83,63,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(51,41,31,0.96)","tileBackgroundColorTo":"rgba(51,41,31,0.79)","tileInnerBackgroundColor":"rgba(104,83,63,0.82)","pageHeaderBackgroundColorFrom":"rgba(51,41,31,1)","pageHeaderBackgroundColorTo":"rgba(51,41,31,1)","pageHeaderTextColor":"rgba(200,182,164,1)","tileHeaderTextColor":"rgba(255,244,232,1)","textColor":"rgba(200,182,164,1)","listBackgroundColor":"rgba(169,219,204,0.58)","listItemBackgroundColor":"rgba(51,41,31,0.79)","tileBackgroundColor":"rgba(104,83,63,0.82)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"14761","constant_id":"0","uipack_name":"","location_id":"0","locationColor":"rgba(177,188,71,1)","negativeLocationColor":"rgba(255,255,255,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(77,168,161,1)","tileBackgroundColorTo":"rgba(126,194,171,1)","tileInnerBackgroundColor":"rgba(255,255,255,0)","pageHeaderBackgroundColorFrom":"rgba(255,255,255,1)","pageHeaderBackgroundColorTo":"rgba(255,255,255,1)","pageHeaderTextColor":"rgba(177,188,71,1)","tileHeaderTextColor":"rgba(255,255,255,1)","textColor":"rgba(87,17,45,1)","listBackgroundColor":"rgba(168,33,89,1)","listItemBackgroundColor":"rgba(126,194,171,1)","tileBackgroundColor":"rgba(77,168,161,0.89)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"14763","constant_id":"0","uipack_name":"","location_id":"0","locationColor":"rgba(221,161,133,1)","negativeLocationColor":"rgba(255,255,255,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(171,51,52,0.93)","tileBackgroundColorTo":"rgba(171,51,52,0.87)","tileInnerBackgroundColor":"rgba(51,25,26,0.14)","pageHeaderBackgroundColorFrom":"rgba(232,209,165,1)","pageHeaderBackgroundColorTo":"rgba(232,209,165,1)","pageHeaderTextColor":"rgba(51,25,26,1)","tileHeaderTextColor":"rgba(237,219,183,1)","textColor":"rgba(51,25,26,1)","listBackgroundColor":"rgba(232,209,165,1)","listItemBackgroundColor":"rgba(171,51,52,0.93)","tileBackgroundColor":"rgba(171,51,52,0.93)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"14764","constant_id":"0","uipack_name":"","location_id":"0","locationColor":"rgba(174,157,150,1)","negativeLocationColor":"rgba(167,216,221,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(241,240,236,0.82)","tileBackgroundColorTo":"rgba(222,219,214,0.76)","tileInnerBackgroundColor":"rgba(250,241,182,0.76)","pageHeaderBackgroundColorFrom":"rgba(167,216,221,0.96)","pageHeaderBackgroundColorTo":"rgba(167,216,221,0.9)","pageHeaderTextColor":"rgba(28,28,28,1)","tileHeaderTextColor":"rgba(33,33,33,1)","textColor":"rgba(41,41,41,1)","listBackgroundColor":"rgba(250,241,182,0.76)","listItemBackgroundColor":"rgba(222,219,214,0.92)","tileBackgroundColor":"rgba(167,216,221,0.96)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"14765","constant_id":"0","uipack_name":"","location_id":"0","locationColor":"rgba(122,110,36,1)","negativeLocationColor":"rgba(250,223,142,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(235,125,36,1)","tileBackgroundColorTo":"rgba(239,156,34,1)","tileInnerBackgroundColor":"rgba(140,105,84,0.95)","pageHeaderBackgroundColorFrom":"rgba(235,125,36,1)","pageHeaderBackgroundColorTo":"rgba(239,156,34,1)","pageHeaderTextColor":"rgba(242,238,179,1)","tileHeaderTextColor":"rgba(255,240,194,1)","textColor":"rgba(250,223,142,1)","listBackgroundColor":"rgba(122,110,36,1)","listItemBackgroundColor":"rgba(235,125,36,1)","tileBackgroundColor":"rgba(239,156,34,1)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"bright","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"3261","constant_id":"0","uipack_name":"","location_id":null,"locationColor":"rgba(173,223,41,1)","negativeLocationColor":"rgba(0,0,0,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(34,41,48,0.832)","tileBackgroundColorTo":"rgba(34,41,48,0.576)","tileInnerBackgroundColor":"rgba(255,90,19,1)","pageHeaderBackgroundColorFrom":"rgba(34,41,48,0.832)","pageHeaderBackgroundColorTo":"rgba(34,41,48,0.832)","pageHeaderTextColor":"rgba(233,233,233,1)","tileHeaderTextColor":"rgba(41,190,223,1)","textColor":"rgba(233,233,233,1)","listBackgroundColor":"rgba(218,0,170,1)","listItemBackgroundColor":"rgba(34,41,48,0.68)","tileBackgroundColor":"rgba(34,41,48,0.512)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"},{"uipack_id":"7407","constant_id":"0","uipack_name":"","location_id":null,"locationColor":"rgba(255,255,255,1)","negativeLocationColor":"rgba(163,140,112,1)","backgroundImageOverlayColor":"rgba(0,0,0,0)","tileBackgroundColorFrom":"rgba(163,140,112,1)","tileBackgroundColorTo":"rgba(163,140,112,1)","tileInnerBackgroundColor":"rgba(163,140,112,1)","pageHeaderBackgroundColorFrom":"rgba(163,140,112,1)","pageHeaderBackgroundColorTo":"rgba(163,140,112,1)","pageHeaderTextColor":"rgba(255,255,255,1)","tileHeaderTextColor":"rgba(255,255,255,1)","textColor":"rgba(255,255,255,1)","listBackgroundColor":"rgba(163,112,149,0.24)","listItemBackgroundColor":"rgba(163,140,112,1)","tileBackgroundColor":"rgba(163,140,112,0.75)","fontPrimary":"AlmoniDLAAA","fontPrimaryBold":"AlmoniDLAAA-Black","brightness":"dark","active":"0","source":"","public":"1","version":"0"}],"code":200,"codeStatus":"OK"};

                    let dataId_tbd = 78654;
                    let time_tbd = "2016-03-01 09:17:00";
                    let colorscheme_id_tbd = 33805;
                    let category_tbd=15;
                    let locationUpdateData={data:   {status:"success",code:200, codeStatus:"OK", facebookPage:fbLink,website:this.data.website.value, displayName:this.data.businessName.value,
                                                    generalInfo:this.data.info.value,colorscheme_id: colorscheme_id_tbd, phone:this.data.phoneLocal.value,phone_prefix:this.data.areaCode.value,category:category_tbd,
                                                    longDisplayName:this.data.businessName.value,addressName:this.data.businessAddress.value, auth_location_id:locationId,auth_location_version:0,token:token,
                                                    data:  {data_id: dataId_tbd, timezone: 247, update_time: time_tbd, create_time: time_tbd, location_id:locationId, version: 0,zap_id : 12,
                                                            displayName: this.data.businessName.value, longDisplayName:this.data.businessName.value, email:this.data.email.value,category:category_tbd,
                                                            phone:this.data.phoneLocal.value,generalInfo_text_alignment:"",phone_prefix:this.data.areaCode.value, joinClubOptions: "JoinClubQuestion",
                                                            uipacks_font:1, app_lang:1,decimals_amount:2, decimals_amount_view_points:0, branchesRangeLimit:0}
                                                    },token:token,auth_location_id:locationId,auth_location_version:0
                                                    };
                                    return Fetch
                                        .post("https://qa.keeprz.com/api/private/location/update",{apiPrefix:"",dataType:"",data:locationUpdateData})
                                        .then((response)=>{
                                            console.log("step1 updated:");
                                            console.log(response);
                                            let group_id_tbd = 9167; // group_id returned from Register post, aved in local storage under groupId
                                            let branch_id_tbd = 49215478;
                                            let branchesData={data:{addressName:this.data.businessAddress.value,positionLong:this.data.addressDetails.value.lng,positionLat:this.data.addressDetails.value.lat,
                                                                    address: this.data.businessAddress.value, group_id:group_id_tbd, branch_id:branch_id_tbd,auth_location_id: locationId, location_id: locationId,token: token},
                                                                    auth_location_id: locationId, location_id: locationId, auth_location_version:0,token: token
                                            };
                                            return Fetch

                                            .post("https://qa.keeprz.com/api/private/branches/Update", {apiPrefix:"",dataType:"",data:branchesData})
                                            .then((response) =>{
                                                    console.log(response);
                                                    return Fetch
                                                        .get("https://qa.keeprz.com/api/private/public/GetFacebookUIThemes?fburl="+ fbLink+"&auth_location_id="+locationId+"&auth_location_version=0&token="+token)
                                                        .then((response)=> {
                                                            console.log("fb themes");
                                                            console.log(response);
                                                            fetchedData.fbThemes = response;
                                                            _self.updateStorage(this.currentStep,fetchedData);
                                                            _self.goToNextUrl(this.currentStep);


                                                        });
                                                });
                                        });


                                    //_self.updateStorage(this.currentStep,response);
                                    //_self.goToNextUrl(this.currentStep);
                //                })
                //        });

                        break;

                case 2:
                    let fbLink2 = this.fbData.link;
                    let token2 = this.token;
                    let objToStore = {response:{}, phoneColors:this.phoneColors}

                    let locationId2 = this.locationId;
                    //let selectedKey=_.findKey(this.justData.schemes,["constant_id",this.justData.selectedScheme]);
                    let selectedKey=_.findIndex(this.justData.schemes, function(o) { return o.constant_id == _self.justData.selectedScheme; });
                    let scheme = this.justData.schemes[selectedKey];
                    let themeToUpdate = {data:scheme, auth_location_id:locationId2, auth_location_version:0, token:token2}
                    return Fetch
                        .post("https://qa.keeprz.com/api/private/uipacks/updateActive",{apiPrefix:"",dataType:"",data:themeToUpdate})
                        .then((response)=> {
                            console.log("step2 updated:");
                            console.log(response);
                            return Fetch
                                .get("https://qa.keeprz.com/api/private/public/UploadFacebookImages?fburl=" + fbLink2 + "&auth_location_id=" + locationId2 + "&auth_location_version=0&token=" + token2)
                                .then((response)=> {
                                    objToStore.response = response;
                                    _self.updateStorage(this.currentStep, objToStore);
                                    _self.goToNextUrl(this.currentStep);
                                });
                        });
                  //  let response = {"status":"success","data":[{"image_id":"197779","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/original\/1453669291_118271837856a53bab88eca3.52520744.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"original","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197780","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/thumb\/1453669291_19126816956a53babd38043.17104849.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"thumb","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197781","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/original\/1453669297_192481003856a53bb132f2a3.70044034.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"original","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197782","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/thumb\/1453669297_20380227056a53bb179ab18.75595879.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"thumb","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197783","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/original\/1453669302_130994961956a53bb6e0fa58.54836036.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"original","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197784","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/thumb\/1453669303_207518022756a53bb72ec324.15166450.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"thumb","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197785","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/original\/1453669309_211602007556a53bbdd04175.04293686.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"original","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197786","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/thumb\/1453669310_214669969556a53bbe466e37.28847628.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"thumb","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197787","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/original\/1453669315_56998388256a53bc3ecfd39.02693273.jpeg","image_group":null,"public":"0","category":"0","type":"logo","size":"original","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197788","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/thumb\/1453669316_213791743256a53bc461d620.05412867.jpeg","image_group":null,"public":"0","category":"0","type":"logo","size":"thumb","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197789","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/original\/1453669322_108244023556a53bcac05bf9.47235224.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"original","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null},{"image_id":"197790","location_id":"5012","url":"https:\/\/keeprzapp.s3.amazonaws.com\/photos\/5012\/thumb\/1453669323_100941797656a53bcb6d7014.54823781.jpeg","image_group":null,"public":"0","category":"0","type":null,"size":"thumb","archive":null,"source":"facebook","resource_id":null,"resource_version":null,"thumb":null}],"code":200,"codeStatus":"OK"};
                    break;
                case 3:
                    console.log("selected images:");
                    console.log(this.data.selectedImages);
                    let images = this.data.selectedImages;
                    let imagesToUpdate = {data:[
                        {text:images[0].imageText, "order": 0, "targetName":images[0].image.image_id, "needToValidate":"N", "status":"published", "image_id": images[0].image.image_id},
                                            {text:images[1].imageText, order: 1, targetName:images[1].image.image_id, needToValidate:"N", status:"published", image_id: images[1].image.image_id},
                                            {text:images[2].imageText, order: 2, targetName:images[2].image.image_id, needToValidate:"N", status:"published", image_id: images[2].image.image_id},
                                            {text:images[3].imageText, order: 3, targetName:images[3].image.image_id, needToValidate:"N", status:"published", image_id: images[3].image.image_id}],
                                            token:this.token,auth_location_id:this.locationId, auth_location_version:0
                    }

                    return Fetch
                    .post("https://qa.keeprz.com/api/private/welcomeMessages/bulkupdate",{apiPrefix:"", dataType:"",data:imagesToUpdate})
                    .then((response) => {
                            console.log("step3 updated:");
                            console.log(response);
                            _self.updateStorage(this.currentStep,{"selectedImages":this.data.selectedImages});
                            _self.goToNextUrl(this.currentStep);
                        });

                    break;
                case 4:
                    /*TBD*/
                    _self.goToNextUrl(this.currentStep)
                    break;
            }

        return {"error":error, data: returnData}
    }
}
export default Handler;