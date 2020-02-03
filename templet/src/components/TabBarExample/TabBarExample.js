import React from 'react';
import { TabBar } from 'antd-mobile';
import Router from 'umi/router';
import './TabBarExample.less';


class TabBarExample extends React.Component {

    constructor(props) {
        super(props);

        let selectedTab = this.props.tab[0].key;
        this.props.tab.map((item) => {
            if(item.path === this.props.children.props.location.pathname) {
                selectedTab = item.key;
                return false;
            }
            return true;
        });

        this.state = {
            iconStyle: this.props.iconStyle? this.props.iconStyle : { width: '22px', height: '22px'},
            selectedTab: this.props.selectedTab? this.props.selectedTab : selectedTab
        };
    }

    // 当路由改变时改变selectedTab
    componentWillReceiveProps(nextProps){
        let selectedTab = this.props.tab[0].key;
        this.props.tab.map((item) => {
            if(item.path === nextProps.children.props.location.pathname) {
                selectedTab = item.key;
                return false;
            }
            return true;
        });
        this.setState({
            selectedTab:selectedTab
        })
    }

    //非路由页面获取页面组件
    getComponent(item) {
        if(!item.path)
            return item.component
        else
            return null;
    }

    handleTabClick(item){
        this.setState({selectedTab: item.key});
        if(this.props.children)
            Router.push(item.path);
    }

    getTabBar() {
        return this.props.tab.map((item) => {
                let selecticon = <i
                    className={this.state.selectedTab === item.key ? 'am-tab-bar-tab-title-select' : null}>{item.selectedIcon}</i>;
                let icon = <i
                    className={this.state.icon === item.key ? 'am-tab-bar-tab-title-select' : null}>{item.icon}</i>;
                return (
                    <TabBar.Item
                        title={<span className={this.state.selectedTab === item.key ? 'am-tab-bar-tab-title-select' : null}>{item.title}</span>} key={item.key}
                        icon={typeof(item.icon) === 'string' ? <div style={Object.assign({}, this.state.iconStyle, {background: item.icon})}></div> : icon}
                        selectedIcon={typeof(item.selectedIcon) === 'string' ? <div style={Object.assign({}, this.state.iconStyle, {background: item.selectedIcon})}></div> : selecticon}
                        selected={this.state.selectedTab === item.key}
                        badge={!item.badge ? 0 : item.badge}
                        onPress={this.handleTabClick.bind(this, item)}
                        data-seed="logId">
                        {this.getComponent(item)}
                    </TabBar.Item>
                )
            }
        )
    }

    render() {
        const view = this.props.children? this.props.children : null;
        return (
            <div className="dcloud-tab-bar">
                <div style={{width: '100%'}}>
                    <div style={{ width: '100%', zIndex: 99}}>
                        {view}
                    </div>
                </div>
                <div style={{position: 'fixed', bottom: 0, width: '100%',zIndex: 99}}>
                    <TabBar
                        unselectedTintColor="#949494"
                        // tintColor="#33A3F4"
                        barTintColor="white"
                        hidden={this.state.hidden}>
                        {this.getTabBar()}
                    </TabBar>
                </div>
            </div>
        );
    }
}
export default TabBarExample;