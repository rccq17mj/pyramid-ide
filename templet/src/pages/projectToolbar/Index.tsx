import React, { useEffect, useState ,FunctionComponent } from "react";
import { Row, Col, Button, Input } from 'antd';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import { PyramidUISendProjectToolBar, PyramidUISendProjectRouteAction } from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIReceiveProjectRouteAction} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
const Search = Input.Search;

const Component: FunctionComponent = () => {
    const [route, setRoute] = useState(localStorage.getItem('currentRoute') || '');

    useEffect(() => {
        const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIReceiveProjectRouteAction) => {
          localStorage.setItem('currentRoute', pyramidAction.payload);
          setRoute(pyramidAction.payload)
        });
        return () => {
            pyramidUiService.clearMessageFn(messageKey);
        }
    }, []);

    const handleClick = (type: 'back' | 'build' | 'layout' | 'module' | 'block') => {
        pyramidUiService.sendMessageFn(new PyramidUISendProjectToolBar({type}));
    };

    const getLinkBar = () => {
        return <div><Search enterButton="刷新" onChange={e => {
            setRoute(e.target.value);
        }} onSearch={value => {
            if(value.indexOf("http://") != -1 === false && value.indexOf("https://") != -1 === false ){
                value = 'http://' + value;
            }
            // 通知页面刷新
            pyramidUiService.sendMessageFn(new PyramidUISendProjectRouteAction(value));
        }} value={route} /></div>
    }

    return (
        <div style={{backgroundColor: '#30303D', height: '90px', lineHeight: '50px', padding:'0 1rem 0 1rem'}}>
            <Row gutter={[8, 0]}>
                <Col span={6}>
                    <Button onClick={()=>{handleClick('back')}} shape="circle" icon="left" />
                </Col>
                <Col span={18}>
                    <div style={{ float: 'right' }}>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <Button  onClick={()=>{handleClick('build')}}  type="default" icon="cloud-sync">构建</Button>
                            </Col>
                            <Col span={6}>
                                <Button  onClick={()=>{handleClick('layout')}}  type="default" icon="appstore">布局</Button>
                            </Col>
                            <Col span={6}>
                                <Button  onClick={()=>{handleClick('module')}}  type="default" icon="build">模块</Button>
                            </Col>
                            <Col span={6}>
                                <Button  onClick={()=>{handleClick('block')}}  type="default" icon="gateway">区块</Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            {getLinkBar()}
        </div>
    )
};

export default Component;
