import React, { FunctionComponent, useEffect, useState } from "react";
import { Row, Col, Button } from 'antd';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
 import { PyramidUISendProjectToolBar } from "@/core/pyramid-ui/action/pyramid-ui.action";


const Component: FunctionComponent = props => {
    const handleClick = (e: string) => {
        let msg = {};
        msg[e] = true;
        pyramidUiService.sendMessageFn(new PyramidUISendProjectToolBar(msg));
    };

    return (
        <div style={{backgroundColor: '#30303D', height: '68px', lineHeight: '68px'}}>
            <Row gutter={[8, 8]}>
                <Col span={6}>
                    <Button onClick={()=>{handleClick('back')}} shape="circle" icon="left" />
                </Col>
                <Col span={18}>
                    <div style={{ float: 'right' }}>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                                <Button  onClick={()=>{handleClick('build')}} type="default" icon="cloud-sync">构建</Button>
                            </Col>
                            <Col span={6}>
                                <Button  onClick={()=>{handleClick('layout')}} type="default" icon="appstore">布局</Button>
                            </Col>
                            <Col span={6}>
                                <Button  onClick={()=>{handleClick('module')}} type="default" icon="build">模块</Button>
                            </Col>
                            <Col span={6}>
                                <Button  onClick={()=>{handleClick('component')}} type="default" icon="gateway">区块</Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Component;