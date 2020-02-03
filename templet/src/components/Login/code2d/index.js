import React, {useEffect, useState} from "react";
import {Icon, Input} from "antd";

/**
 * 二维码组件
 * @param props
 * @returns {*}
 * @constructor
 */
const InputCode2D = (props , ref) => {
    const value = props.value || {};
    const [src, setSrc] = useState(null);
    const [number, setNumber] = useState(value.number || '');
    let refresh = null;

    useEffect(() => {
        const _refresh = getQueryVariable('refresh', props.src);
        if ((src === '' && props.src !== '') || refresh != _refresh)
            setSrc(props.src + '&t=' + new Date().getTime())
        refresh = _refresh;
    },[props.src])

    const getQueryVariable = (variable, src) => {
        let query = src;
        let vars = query.split("&");
        for (let i=0;i<vars.length;i++) {
            let pair = vars[i].split("=");
            if(pair[0] == variable){
                return pair[1];
            }
        }
        return(false);
    }

    const handleNumberChange = (e) => {
       const _number = e.target.value;
       setNumber(_number);
       triggerChange({number: _number});
    }

    const triggerChange = changedValue => {
        const onChange = props.onChange;
        if (onChange) {
            onChange(Object.assign({}, {src, number}, changedValue));
        }
    };

    const reCode = () => {
        setSrc(props.src + '&t=' + new Date().getTime())
    }

    return (
        <div ref={ref} style={{display: "flex"}}>
            <div style={{flex: 2, display: "block"}}>
                <Input autoComplete="off" defaultValue='' value={number} maxLength={4} onChange={handleNumberChange} placeholder="请输入验证码"
                       id="success"/>
            </div>
            <div style={{flex: 1, display: "block"}}>
                {
                    src === '' ? <Icon style={{textAlign:'center',width: '100%'}} type="loading"/> :
                        <img className='codeImg' onClick={reCode} style={{flex: 1, display: "block"}}
                             src={src}/>
                }
            </div>
        </div>
    )
}

export default InputCode2D;
