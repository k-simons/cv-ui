import * as React from "react";
import { IDateMap, RowResult } from "../../data-fetching/fetcher";
import { XAxis, LineChart, BarChart, YAxis, Legend, CartesianGrid, Line, Tooltip, Bar } from "recharts";
import { Classes, IButtonProps, IPopoverProps, MenuItem, Position } from "@blueprintjs/core";
import { MAX_ITEMS_TO_RENDER, SingleSelect } from "../select/singleSelect/singleSelect";
import { AriesMultiSelect } from "../select/ariesMultiSelect/ariesMultiSelect";



interface IProps {
    dateMap: IDateMap
}

interface ISingleSeries {
    name: string;
    data: Array<ISingleDate>;
}

interface ISingleDate {
    category: string;
    value: number;
}

interface IFilterSet {
    count: number;
    name: string;
}

const series = [
    {
      name: 'Series 1',
      data: [
        { category: 'A', value: Math.random() },
        { category: 'B', value: Math.random() },
        { category: 'C', value: Math.random() },
      ],
    },
    {
      name: 'Series 2',
      data: [
        { category: 'B', value: Math.random() },
        { category: 'C', value: Math.random() },
        { category: 'D', value: Math.random() },
      ],
    },
    {
      name: 'Series 3',
      data: [
        { category: 'C', value: Math.random() },
        { category: 'D', value: Math.random() },
        { category: 'E', value: Math.random() },
      ],
    },
  ];


  // http://recharts.org/en-US/examples/SimpleBarChart

  /**
   *
  next
  1) Key of RowResult to select the data set
  2) Dropdown to filter
  3) And to limit
   */


  type KeyOfRowResultWithAll = Omit<RowResult, "state">
  type KeyOfRowResult = keyof KeyOfRowResultWithAll;

  interface IState {
    activeSeries: KeyOfRowResult
    stateFilter: Array<string>
}

const VizSelect = SingleSelect.ofType<KeyOfRowResult>();
const StringMultiSelect = AriesMultiSelect.ofType<string>();

export class GraphView extends React.PureComponent<IProps, IState> {

    public state: IState = {
        activeSeries: "newCases",
        stateFilter: []
    };

    public render() {
        const stateList = {}
        Object.values(this.props.dateMap).forEach(a => {
            a.forEach(b => {
                (stateList as any)[b.state] = {}
            })
        })
        const items = Object.keys(stateList).sort() as Array<string>
        const dataMap = this.filterTheGraph(this.props.dateMap)
        const seriesSet: Array<ISingleSeries> = []
        Object.keys(dataMap).sort().map(singleDate => {
            const rowResults = dataMap[singleDate]
            rowResults.map(r => {
                const existingSet = seriesSet.find(s => s.name == r.state)
                const singleData: ISingleDate = {
                    category: singleDate,
                    value: r[this.state.activeSeries],
                }
                if (existingSet == null) {
                    const singleSeries :ISingleSeries = {
                        name: r.state,
                        data: [singleData],
                    }
                    seriesSet.push(singleSeries)
                } else {
                    existingSet.data.push(singleData)
                }
            })
        })
        const subsetOfData = this.props.dateMap["03/22/2020"].map(singleRow => {
            return {
                name: singleRow.state,
                total : singleRow.total,
            }
        })
        /**
         <BarChart
             width={1500}
             height={800}
             data={subsetOfData}
             margin={{
             top: 5, right: 30, left: 20, bottom: 5,
             }}
         >
             <CartesianGrid strokeDasharray="3 3" />
             <XAxis dataKey="name" />
             <YAxis />
             <Tooltip />
             <Bar dataKey="total" fill="#8884d8" />
         </BarChart>

         // <SelectButton/>
         */

        return (
            <div className="ar-grah-div">
                <VizSelect
                    itemToString={(t => t)}
                    items={["newCases", "newDeaths", "total", "totalDeaths", "totalRecovered", "activeCases"]}
                    onItemSelect={(activeSeries => this.setState({activeSeries}))}
                    value={this.state.activeSeries}
                />
                <StringMultiSelect
                    itemToString={(t => t)}
                    items={items}
                    onItemSelect={(stateFilter => this.setState({stateFilter}))}
                    values={this.state.stateFilter}
                />

                <LineChart width={500} height={300}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
                    <YAxis dataKey="value" />
                    <Tooltip />
                    {seriesSet.map(s => (
                    <Line dataKey="value" data={s.data} name={s.name} key={s.name} />
                    ))}
                </LineChart>
            </div>
        )
    }

    private onItemSelect = (activeItem: string) => {
        console.log(activeItem)
    }

    private itemRenderer = (item: string, itemProps: any) => {
        if (!itemProps.modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                className={itemProps.modifiers.active ? Classes.ACTIVE : ""}
                key={itemProps.index}
                onClick={itemProps.handleClick}
                text={item}
                shouldDismissPopover={false}
            />
        );
    }

    private filterTheGraph(dateMap: IDateMap): IDateMap {
        const filterSets: Array<IFilterSet> = []
        const filteredDateMap: IDateMap = {}
        Object.keys(dateMap).map(date => {
            dateMap[date].map(r => {
                if (this.state.stateFilter.length == 0 || this.state.stateFilter.find(a => a == r.state) != undefined) {
                    const existing = filterSets.find(f => f.name == r.state)
                    if (existing == null) {
                        filterSets.push({count: r[this.state.activeSeries], name: r.state})
                    } else {
                        existing.count = existing.count + r[this.state.activeSeries]
                    }
                }
            })
        })
        const sorted = filterSets.sort((a, b) => b.count - a.count).slice(0, 15);
        Object.keys(dateMap).map(date => {
            const filtered = dateMap[date].filter(r => {
                return sorted.find(s => s.name == r.state) != null
            })
            if (filtered.length != 0) {
                filteredDateMap[date] = filtered
            }
        })
        console.log(filteredDateMap)
        return filteredDateMap
    }

}
