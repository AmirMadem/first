import React, { useState, useEffect,useRef} from "react";
import getData from '../../getData.js';
import manageData from '../../manageData.js';
import ReactDOM from 'react-dom';
import SearchinBox from "../SearchinBox.js";
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-scroll';
import useDraggableScroll from 'use-draggable-scroll';
import VotingBar from '../VotingBar.js'
import ExpVotingBar from '../ExpVotingBar.js'
import AddingConnector from "../AddinConnector.js";
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';



const RotatedSquare = (props) => {

    function arcctg(x) { return Math.PI / 2 - Math.atan(x); }

    var squareSize;
    const anchorPointX = 0;
    const anchorPointY = 0;

    
    var lineWidth;
    var posTop;
    var posLeft;

    var tan;
    var angel;
    var isDirectionLeft = false;
    if(props.claimLoc.offsetLeft - props.connectorLoc.offsetLeft < 0){
        isDirectionLeft = true;
    }
    var widthDistance = Math.abs(props.claimLoc.offsetLeft - props.connectorLoc.offsetLeft) ;
    var heigthDistance = Math.abs(props.claimLoc.offsetTop - props.connectorLoc.offsetTop) ;

    tan = heigthDistance/widthDistance;

    angel = 90 - arcctg(tan)*57.2958;
    if(!!isDirectionLeft){
        angel = 180 - angel;
    }

    if(angel != 90){
        lineWidth =Math.abs(widthDistance/Math.cos(angel/57.2958));
    }
    else{
        lineWidth = heigthDistance;
    }

    squareSize = lineWidth;
  
    const squareStyle = {
      height: squareSize,
      width: squareSize,
      borderTop:'groove',
      borderTopColor:props.color,
      borderTopWidth:'1px'
    };
  
    return (
        <View
            style={[
                squareStyle,
                {
                    transform: [
                        {translateX: anchorPointX - squareSize / 2},
                        {translateY: anchorPointY - squareSize / 2},
                        {rotateZ:angel +'deg'},
                        {translateX: -(anchorPointX - squareSize / 2)},
                        {translateY: -(anchorPointY - squareSize / 2)},
                    ],
                },
            ]}
        />
    );
};

export default RotatedSquare;