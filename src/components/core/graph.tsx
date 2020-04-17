import * as React from "react";
import { IDateMap, RowResult } from "../../data-fetching/fetcher";
import { XAxis, LineChart, BarChart, YAxis, Legend, CartesianGrid, Line, Tooltip, Bar, ItemSorter , TooltipPayload } from "recharts";
import { Classes, IButtonProps, Checkbox, IPopoverProps, MenuItem, Position, NumericInput } from "@blueprintjs/core";
import { MAX_ITEMS_TO_RENDER, SingleSelect } from "../select/singleSelect/singleSelect";
import { AriesMultiSelect } from "../select/ariesMultiSelect/ariesMultiSelect";
import { StatePopulation } from "./stateData";



interface IProps {
    dateMap: IDateMap
}

interface ISingleSeries {
    name: string;
    data: Array<ISingleDate>;
}

interface IBarSeries {
    name: string;
    optionTotal: number;
    stockTotal: number;
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
    perPopulation: boolean
    excludeStateFilter: Array<string>
}

const VizSelect = SingleSelect.ofType<KeyOfRowResult>();
const StringMultiSelect = AriesMultiSelect.ofType<string>();

const callPriceToPremium: {[date: number]: number; } = {
    10.00: 21.63,
    11.00: 20.73,
    12.00: 19.68,
    13.00: 18.70,
    14.00: 17.95,
    15.00: 17.08,
    16.00: 16.23,
    17.00: 15.48,
    18.00: 14.48,
    19.00: 13.90,
    20.00: 12.98,
    21.00: 11.98,
    22.00: 11.38,
    23.00: 10.60,
    24.00: 9.88 ,
    25.00: 9.18 ,
    26.00: 8.48 ,
    27.00: 8.00 ,
    28.00: 7.23 ,
    29.00: 6.65 ,
    30.00: 6.05 ,
    31.00: 5.55 ,
    32.00: 5.05 ,
    33.00: 4.58 ,
    34.00: 4.15 ,
    35.00: 3.63 ,
    36.00: 3.45 ,
    37.00: 3.05 ,
    38.00: 2.74 ,
    39.00: 2.43 ,
    40.00: 2.17 ,
    41.00: 1.94 ,
    42.00: 1.77 ,
    43.00: 1.67 ,
    44.00: 1.52 ,
    45.00: 1.31 ,
    46.00: 1.06 ,
    47.00: 1.10 ,
    48.00: 0.96 ,
    49.00: 0.89 ,
    50.00: 0.75 ,
    52.50: 0.54 ,
    55.00: 0.34 ,
    57.50: 0.21 ,
    60.00: 0.23 ,
    62.50: 0.23 ,
    65.00: 0.15 ,
    67.50: 0.10 ,
    70.00: 0.07 ,
    72.50: 0.10 ,
    75.00: 0.09 ,
    77.50: 0.08 ,
    80.00: 0.07 ,
    82.50: 0.06 ,
    85.00: 0.06 ,
    87.50: 0.05 ,
    90.00: 0.03 ,
    92.50: 0.02 ,
    95.00: 0.02 ,
    97.50: 0.04 ,
    100.00: 0.05 ,
    105.00: 0.05 ,
    110.00: 0.04 ,
    115.00: 0.04 ,
}

export class GraphView extends React.PureComponent<IProps, IState> {
    public render() {
        const contractCount = 1
        const optionsInContract = 100
        const totalOptions = contractCount * optionsInContract
        const premium = 3.75
        const callPrice = 35.00
        const fixedLoss = contractCount * totalOptions * premium
        const stockPurchased = 20
        const currentPrice = 34.10
        const seriesSet: Array<IBarSeries> = []
        for (let step = 24; step < 44; step++) {
            const diffInOrder = (step - callPrice) * totalOptions;
            const totalDiff = diffInOrder - fixedLoss;
            const optionTotal = Math.max(-1 * fixedLoss, totalDiff)
            const stockTotal = (step - currentPrice) * stockPurchased
            seriesSet.push(
                {
                    optionTotal: optionTotal,
                    name: step + "",
                    stockTotal: stockTotal
                })
        }
        return (
            <div>
                <NumericInput>

                </NumericInput>
            <BarChart
                width={1300}
                height={800}
                data={seriesSet}
                margin={{
                top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="optionTotal" fill="#8884d8" />
                <Bar dataKey="stockTotal" fill="#82ca9d" />
            </BarChart>
            </div>
        )
    }
}
export class GraphView2 extends React.PureComponent<IProps, IState> {

    public state: IState = {
        activeSeries: "newCases",
        excludeStateFilter: [],
        showDiff: false,
        perPopulation: false,
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
                    <Checkbox
                        checked={this.state.perPopulation}
                        onChange={this.onCheckChangePopulation}
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

    private onCheckChangePopulation = () => {
        this.setState({perPopulation: !this.state.perPopulation})
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
        const copied = JSON.parse(JSON.stringify(filteredDateMap)) as IDateMap
        console.log(this.state.perPopulation)
        if (this.state.showDiff) {
            const keys = Object.keys(filteredDateMap).sort()
            keys.forEach((key, i) =>  {
                if ((i + 1) == keys.length) {
                    delete copied[key];
                    return
                }
                if (i == 0) {
                    copied[key].forEach(r => {
                        r[this.state.activeSeries] = 0
                    })
                    return;
                } else {
                    copied[key].forEach(r => {
                        filteredDateMap[keys[i-1]].forEach(rPrime => {
                            if (r.state == rPrime.state) {
                                r[this.state.activeSeries] = r[this.state.activeSeries] - rPrime[this.state.activeSeries]
                            }
                        })
                    })
                }
            })
        } else if (this.state.perPopulation) {
            Object.keys(copied).sort().forEach(key =>  {
                copied[key].forEach(r => {
                    const found = StatePopulation.find(s => s.State == r.state)
                    if (found == null) {
                        console.log("NOT FOUND")
                        console.log(r)
                        r[this.state.activeSeries] = 0
                    } else {
                        r[this.state.activeSeries] = r[this.state.activeSeries] / found.Pop
                    }
                })
            })
        }
        return copied
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
