import React,{useEffect} from 'react';
import styles from './index.less';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import { PyramidUISendPublicConsole } from "@/core/pyramid-ui/action/pyramid-ui.action";

import { Button, Icon } from 'antd';

const StatusBar: React.FC = props => {
    const handleClick = e => {
        pyramidUiService.sendMessageFn(new PyramidUISendPublicConsole());
    };

    return (
        <div className={styles.statusBar} >
            <Button onClick={handleClick} type="link"><Icon type="code" /></Button>
        </div>
    )
}

export default StatusBar;