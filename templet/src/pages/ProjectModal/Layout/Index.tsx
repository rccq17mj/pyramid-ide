import React, {FunctionComponent, useEffect, useState} from 'react';
import {Button, Col, Row, Slider} from "antd";
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import { PyramidUISendProjectLayoutChooseAction } from '@/core/pyramid-ui/action/pyramid-ui.action';

interface IProps {
}

const Component: FunctionComponent<IProps> = props => {
  const [colCountKey, setColCountKey] = useState<number>(0);
  const colCounts = {
    0: <span style={{color: 'white'}}>2</span>,
    1: <span style={{color: 'white'}}>3</span>,
    2: <span style={{color: 'white'}}>4</span>,
    3: <span style={{color: 'white'}}>6</span>,
    4: <span style={{color: 'white'}}>12</span>,
    5: <span style={{color: 'white'}}>24</span>
  };

  useEffect(() => {
  }, []);

  const onColCountChange = (colCountKey: number) => {
    setColCountKey(colCountKey)
  };

  const renderCol = () => {
    const cols = [];

    for (let i = 0; i < switchKeyToValue(); i++) {
      cols.push(
        <Col key={i.toString()} span={24 / switchKeyToValue()}>
          {
            i % 2 === 0 ? (
              <div style={{height: '10px', background: '#56BDEF'}} />
            ) : (
              <div style={{height: '10px', background: '#03A0E9'}} />
            )
          }

        </Col>,
      );
    }
    return cols;
  };

  const switchKeyToValue = () => {
    let colCountValue = 0;
    switch (colCountKey) {
      case 0:
        colCountValue = 2;
        break;
      case 1:
        colCountValue = 3;
        break;
      case 2:
        colCountValue = 4;
        break;
      case 3:
        colCountValue = 6;
        break;
      case 4:
        colCountValue = 12;
        break;
      case 5:
        colCountValue = 24;
        break;
    }
    return colCountValue;
  };

  const use = () => {
    const value = switchKeyToValue();
    pyramidUiService.sendMessageFn(new PyramidUISendProjectLayoutChooseAction({column: value}));
  };

  return (
    <div style={{padding: '20px', color: 'white'}}>
      <p style={{marginBottom: 10}}>列数</p>
      <Slider
        min={0}
        max={5}
        value={colCountKey}
        onChange={onColCountChange}
        marks={colCounts}
        step={null}
      />
      <p style={{marginTop: 50, marginBottom: 10}}>演示</p>
      <Row>
        {renderCol()}
      </Row>
      <Button type="primary" style={{marginTop: 50}} onClick={() => use()}>使用</Button>
    </div>
  )
};

export default Component;
