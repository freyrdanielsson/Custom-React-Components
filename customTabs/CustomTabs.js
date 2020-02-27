import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "./CustomTabs.css";

export default function CustomTabs(props) {
    const { onChange=()=>{}, tabContent, idx } = props;


    // List out tabs
    const tabs = tabContent.map((item) => {
        return (
            <Tab
                className="tabs__tab"
                disabledClassName="tabs__tab--disabled"
                selectedClassName="tabs__tab--selected"
                key={item.title}
            >
                {item.title}
            </Tab>
        );
    });

    // List out panels for the tabs
    const panels = tabContent.map((item, key) => {
        return (
            <TabPanel
                className="tabs__tab-panel"
                selectedClassName="tabs__tab-panel--selected"
                key={key}
            >
                {item.content}
            </TabPanel>
        );
    });

    return (
        <Tabs
            selectedIndex={idx}
            onSelect={tabIndex => onChange(tabIndex)}
            className="tabs"
            disabledTabClassName="tabs__tab--disabled"
            selectedTabClassName="tabs__tab--selected"
            selectedTabPanelClassName="tabs__tab-panel--selected"

        >
            <TabList className="tabs__tab-list">
                {tabs}
            </TabList>
            <div>
                {panels}
            </div>
        </Tabs>
    );
}