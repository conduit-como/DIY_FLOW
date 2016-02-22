import React, { Component } from 'react';
import style from './step3.scss';
import Button from '../generalComponents/button';
import lodash from 'lodash';
import Handler from '../../api/handler';
import ThumbsSlider from '../generalComponents/slider';
import jQuery from 'jquery';
import InfoIcon from '../generalComponents/icons/infoIcon';
import RewardsIcon from '../generalComponents/icons/rewardsIcon';

const defaultImgText = "Add your image title";

export default class Step3 extends Component {
    constructor(props) {
        super(props);

        this.state =
        {
            data: {
                loaded : true
            }
        }
        this._handleBtnClick = this._handleBtnClick.bind(this);

    }
    _handleBtnClick(){
        jQuery("#step3 .btnWrap button").html("<img src='images/ajax-loader1.gif'/>");
        this.props.handleBtnClick(this.refs, "sendImages", event);
    }


    _createImageItem(item,index){
        let imageId = "image_"+item.image.image_id+"_index_"+index;
        let wrapClasses = "imageWrap columns large-3 imageId_"+item.image.image_id;
        let imageWrapperOpacity = this.state.data.loaded ? 1 : 0;
        if(item.selected == true){
            wrapClasses += " selected";
        }
        let keyId = item.image.image_id+ Math.floor((Math.random() * 1000) + 1);
        return (
            <div className={wrapClasses} key={keyId} id={imageId} style={{opacity:imageWrapperOpacity}}>
                <div className="borderWrap">
                    <div className="innerWrap" style={{backgroundSize:"cover",backgroundImage:"url('"+item.image.url+"')",backgroundRepeat:"no-repeat",backgroundPosition:"center center"}}  onClick={this.props.selectImage.bind(null, index,item.image.image_id)}>
                        <div className="blanket"></div>
                    </div>
                </div>
                <input className="imageDescription" defaultValue={item.imageText} ref="SelectedText" onFocus={this.props.toggleClass.bind(null, {className:"blanket",toggleClass:"noHover", action:"add"})} onBlur={this.props.onTextInputBlur.bind(null,{"index":index},{className:"blanket",toggleClass:"noHover", action:"remove"})}/>
            </div>
        )
    }


    render(){
        let wrapClass = "phone "+this.props.phoneColors.brightness;
        return (
            <div id="step3" className="pageWrap lightGreyBg" onClick={this.props.onPageClick}>
                <div className="absolute pagination"><span className="huge">3</span><span className="tiny">/4</span></div>
                <div className="vAlign">
                    <div className="row">
                        <div className="columns large-10 titleWrap">
                            <h1 className="businessTitle">Welcome messages</h1>
                        </div>
                    </div>
                    <div className="topPhone">
                        <div className="row">
                            <div className="columns large-4">
                                <p className="subtitle">Edit your welcom messages to attract and engage users, showcasing your delicious food, great products, happy customers etc.</p>
                            </div>
                            <div className="columns large-4 end large-offset-3">
                                <div className={wrapClass}>
                                    <div className="inner">
                                        <div className="topPas" style={{backgroundColor: this.props.phoneColors.upperColor}}>
                                            <div className="dynamic"></div>
                                        </div>
                                        <div className="bgWrap" style={{backgroundColor:this.props.phoneColors.bgColor}}>
                                            <div className="iconsRow">
                                                <div className="iconColumnWrap" style={{float:"left"}}>
                                                    <div className="iconColumn"  ref="iconBg">
                                                        <InfoIcon fillColor={this.props.phoneColors.iconsColor}/>
                                                    </div>
                                                    <div className="iconBorder"></div>
                                                </div>
                                                <div className="iconColumnWrap" style={{float:"right"}}>
                                                    <div className="iconColumn">
                                                        <RewardsIcon fillColor={this.props.phoneColors.iconsColor}/>
                                                    </div>
                                                    <div className="iconBorder"></div>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="welcomeImages">
                                                <div className="imageOnScreen" style={{backgroundImage:"url('"+this.props.imageOnScreen+"')"}}></div>

                                            </div>
                                            <div className="iconsRow">
                                                <div className="iconColumnWrap" style={{float:"left"}}>
                                                    <div className="iconColumn" style={{backgroundColor: this.props.phoneColors.iconsColor}}></div>
                                                    <div className="iconBorder"></div>
                                                </div>
                                                <div className="iconColumnWrap" style={{float:"right"}}>
                                                    <div className="iconColumn" style={{backgroundColor: this.props.phoneColors.iconsColor}}></div>
                                                    <div className="iconBorder"></div>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="images">
                        <div className="row">
                            {this.props.selectedImages.map(this._createImageItem, this)}
                        </div>
                    </div>
                    <div className="slider">
                        <div className="row">
                            <ThumbsSlider selectedImageId={this.props.selectedFromGalleryImageId} images={this.props.allImages} thumbGoTo={this.props.thumbGoTo} onClickThumb={this.props.onClickThumb.bind(null,this)}/>
                        </div>
                    </div>
                    <div className="nextBtn">
                        <div className="row">
                            <Button foundationClasses="large-4 columns large-offset-7" buttonSize="large" btnText="NEXT" onClick={this._handleBtnClick}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
Step3.propTypes = {
    phoneColors: React.PropTypes.object.isRequired,
    onPageClick: React.PropTypes.func.isRequired,
    imageOnScreen: React.PropTypes.string.isRequired,
    selectedImages: React.PropTypes.array.isRequired,
    allImages: React.PropTypes.array.isRequired,
    onClickThumb: React.PropTypes.func.isRequired,
    selectImage: React.PropTypes.func.isRequired,
    onTextInputBlur: React.PropTypes.func.isRequired,
    handleBtnClick: React.PropTypes.func.isRequired
}