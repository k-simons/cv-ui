import * as React from "react";
import { IDateMap, RowResult } from "../../data-fetching/fetcher";
import { XAxis, LineChart, BarChart, YAxis, Legend, CartesianGrid, Line, Tooltip, Bar, ItemSorter , TooltipPayload } from "recharts";
import { Classes, IButtonProps, Checkbox, IPopoverProps, MenuItem, Position } from "@blueprintjs/core";
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
    showDiff: boolean
    excludeStateFilter: Array<string>
}

const VizSelect = SingleSelect.ofType<KeyOfRowResult>();
const StringMultiSelect = AriesMultiSelect.ofType<string>();

export class GraphView extends React.PureComponent<IProps, IState> {

    public state: IState = {
        activeSeries: "newCases",
        excludeStateFilter: [],
        showDiff: true,
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
                <div className="ar-grah-filter-div">
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
                    <StringMultiSelect
                        itemToString={(t => t)}
                        items={items}
                        onItemSelect={(excludeStateFilter => this.setState({excludeStateFilter}))}
                        values={this.state.excludeStateFilter}
                    />
                    <Checkbox
                        checked={this.state.showDiff}
                        onChange={this.onCheckChange}
                    />
                </div>
                <LineChart width={1000} height={600}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
                    <YAxis dataKey="value" />
                    <Tooltip
                    itemSorter={(a, b) => this.itemSorter(a, b)}
                    />
                    {seriesSet.map((s, i) => (
                    <Line dataKey="value" data={s.data} name={s.name} key={s.name} stroke={this.getFill(i)} />
                    ))}
                </LineChart>
            </div>
        )
    }

    private onCheckChange = () => {
        this.setState({showDiff: !this.state.showDiff})
    }

    private getFill(index: number): string {
        const fills = ["#2965CC", "#29A634", "#D99E0B", "#D13913", "#8F398F", "#00B3A4", "#DB2C6F", "#9BBF30", "#96622D", "#7157D9"]
        return fills[index % 10]
    }

    private itemSorter(a: TooltipPayload, b: TooltipPayload): number {
        return (a.value as number) * -1
        console.log(b)
        if (a == null && b == null) {
            return 0
        }
        if (a == null) {
            return 1
        }
        if (b == null) {
            return -1
        }
        return (a.value as number) - (b.value as number)
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
        const keys = Object.keys(dateMap).sort()
        keys.map((date, i) => {
            dateMap[date].map(r => {
                if (this.passedFilter(r)) {
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

    private passedFilter(rowResult: RowResult): boolean {
        return this.passedStateFilter(rowResult) && this.passedStateExclude(rowResult)
    }

    private passedStateFilter(rowResult: RowResult): boolean {
        return this.state.stateFilter.length == 0 || this.state.stateFilter.find(a => a == rowResult.state) != undefined
    }

    private passedStateExclude(rowResult: RowResult): boolean {
        return this.state.excludeStateFilter.length == 0 || this.state.excludeStateFilter.find(a => a == rowResult.state) == undefined
    }

}
