
/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const PropTypes = require('prop-types');
const CompactCatalog = require('./CompactCatalog');
const LayerToolbar = require('./LayerToolbar');

class DataCatalog extends React.Component {
    static propTypes = {
        onShowDetails: PropTypes.func,
        catalogURL: PropTypes.string,
        filterList: PropTypes.node,
        filterForm: PropTypes.node,
        onShowBbox: PropTypes.func,
        onZoomTo: PropTypes.func,
        sortBy: PropTypes.string,
        groupInfo: PropTypes.object,
        onAddLayer: PropTypes.func,
        layers: PropTypes.array,
        bboxFilter: PropTypes.string,
        onRemove: PropTypes.func
    };

    static defaultProps = {
        onShowDetails: () => {},
        catalogURL: '',
        filterList: null,
        filterForm: null,
        onShowBbox: () => {},
        onZoomTo: () => {},
        sortBy: '',
        groupInfo: {},
        onAddLayer: () => {},
        onRemove: () => {},
        layers: []
    };

    render() {
        const FilterList = this.props.filterList;
        return (
            <div className="et-catalog" style={{display: 'flex', flex: 1, height: '100%'}}>
                <FilterList/>
                {this.props.catalogURL && <CompactCatalog
                    filterForm={this.props.filterForm}
                    onRecordSelected={() => {}}
                    sortBy={this.props.sortBy}
                    bboxFilter={this.props.bboxFilter}
                    groupInfo={this.props.groupInfo}
                    layers={this.props.layers}
                    getCustomItem={
                        (item) => ({
                            title: <span>{item.title}</span>,
                            description: <span>{item.description}</span>,
                            caption: <span>{item.caption}</span>,
                            preview: item.icon ? <i className={'fa fa-4x text-center fa-' + item.icon}></i> : null,
                            style: this.props.groupInfo[item.caption] && this.props.groupInfo[item.caption].checked && this.props.groupInfo[item.caption].color ? {
                                borderBottom: '2px solid ' + this.props.groupInfo[item.caption].color
                            } : {},
                            onMouseEnter: () => {
                                const feature = item && item.record && {...item.record};
                                if (feature) {
                                    this.props.onShowBbox('bbox_layer', 'layers', {
                                        features: [feature],
                                        style: {
                                            fill: {
                                                color: 'rgba(52, 52, 52, 0.1)' // 'transparent' // "rgba(33, 186, 176, 0.25)"
                                            },
                                            stroke: {
                                                color: this.props.groupInfo[item.caption] && this.props.groupInfo[item.caption].checked && this.props.groupInfo[item.caption].color || '#aaa',
                                                width: this.props.groupInfo[item.caption] && this.props.groupInfo[item.caption].checked && this.props.groupInfo[item.caption].color ? 2 : 1,
                                                opacity: 1
                                            }
                                        }
                                    });
                                }
                            },
                            onMouseLeave: () => {
                                this.props.onShowBbox('bbox_layer', 'layers', {
                                    features: [],
                                    style: {}
                                });
                            },
                            onClick: () => {
                                this.props.onShowDetails(item.record ? {...item.record} : {});
                            },
                            tools: <LayerToolbar
                                item={{...item.record}}
                                showAddLayer
                                showRemoveLayer
                                layers={this.props.layers}
                                showFilter={false}
                                onZoomTo={this.props.onZoomTo}
                                onRemoveLayer={this.props.onRemove}
                                onAddLayer={this.props.onAddLayer}/>
                        })
                    }
                    catalog= {{
                        url: this.props.catalogURL,
                        type: 'hev-e',
                        title: 'HEV-E',
                        autoload: true
                    }}/>}
            </div>
        );
    }
}

module.exports = DataCatalog;