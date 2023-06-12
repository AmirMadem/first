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
import RotatedSquare from "./RotatedSquare.js"


const CONNECTOR_WIDTH = 120;
const CONNECTOR_HEIGTH = 60; 
const CONNECTOR_LEFT_GAP = 220;
const CONNECTOR_TOP_GAP = 200;
const VOTING_BAR_WIDTH = 300;

const Wings = (props) =>{

    var connectorLocation = props.connectorLocation;
    var wingEdge = {};
    var wingEdge2 = {};
    var wingSize = CONNECTOR_HEIGTH/8;
    if(!!connectorLocation){
        wingEdge =
        {
            offsetLeft: connectorLocation.offsetLeft,
            offsetTop: connectorLocation.offsetTop,
        }
        wingEdge2 =
        {
            offsetLeft: connectorLocation.offsetLeft+CONNECTOR_WIDTH,
            offsetTop: connectorLocation.offsetTop,
        }
    }
    var color = props.color;

    var connectorLocationTemp = {
        offsetLeft:connectorLocation.offsetLeft-wingSize,
        offsetTop: connectorLocation.offsetTop-wingSize 
    }
    var connectorLocationTemp2 = {
        offsetLeft:connectorLocation.offsetLeft+wingSize+CONNECTOR_WIDTH,
        offsetTop: connectorLocation.offsetTop-wingSize 
    }
  
    return(
        <div>
            <div style={{color:color,position:'absolute',top: -wingSize,left:-wingSize}}>
                <RotatedSquare connectorLoc={connectorLocationTemp} claimLoc={wingEdge} color={color}/>
            </div>
            <div style={{color:color,position:'absolute',top: -wingSize,left:wingSize+CONNECTOR_WIDTH}}>
                <RotatedSquare connectorLoc={connectorLocationTemp2} claimLoc={wingEdge2} color={color}/>
            </div>
        </div>
    )
}

export default Wings;