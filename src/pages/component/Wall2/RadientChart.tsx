import React, { useLayoutEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const PieOfPieChart: React.FC = () => {
  const chartId = React.useMemo(() => `chartdiv-${Math.random().toString(36).substr(2, 9)}`, []);

  useLayoutEffect(() => {
    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    const container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.p100,
        height: am5.percent(80),
        layout: root.horizontalLayout,
        paddingLeft: 20
      })
    );

    const title = container.children.unshift(
      am5.Label.new(root, {
        text: "Pie of Pie Chart",
        fontSize: 22,
        fontWeight: "500",
        textAlign: "left",
        x: am5.percent(0),
        centerX: am5.percent(0),
        paddingTop: 0,
        paddingBottom: 20,
        fill: am5.color("#ffffff")
      })
    );

    const chart = container.children.push(
      am5percent.PieChart.new(root, {
        tooltip: am5.Tooltip.new(root, {}),
        x: am5.percent(0),
        centerX: am5.percent(0)
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false
      })
    );
console.log('series==>',series);
    series.labels.template.setAll({
      textType: "circular",
      radius: 10,
      fontSize: 11,
      // fill: am5.color("#ffffff")
    });
    series.ticks.template.set("visible", false);
    series.slices.template.set("toggleKey", "none");

    series.slices.template.events.on("click", function(e) {
      selectSlice(e.target);
    });

    const subChart = container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(35),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    const subSeries = subChart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category"
      })
    );
    
    subSeries.labels.template.setAll({
      textType: "circular",
      radius: 8,
      fontSize: 11,
      // fill: am5.color("#ffffff")
    });

    subSeries.data.setAll([
      { category: "A", value: 0 },
      { category: "B", value: 0 },
      { category: "C", value: 0 },
      { category: "D", value: 0 }
    ]);
    subSeries.slices.template.set("toggleKey", "none");

    let selectedSlice: any;

    series.on("startAngle", function() {
      updateLines();
    });

    container.events.on("boundschanged", function() {
      root.events.once("frameended", function() {
        updateLines();
      })
    });

    function updateLines() {
      if (selectedSlice) {
        const startAngle = selectedSlice.get("startAngle");
        const arc = selectedSlice.get("arc");
        const radius = selectedSlice.get("radius");

        const x00 = radius * am5.math.cos(startAngle);
        const y00 = radius * am5.math.sin(startAngle);

        const x10 = radius * am5.math.cos(startAngle + arc);
        const y10 = radius * am5.math.sin(startAngle + arc);

        const subRadius = subSeries.slices.getIndex(0).get("radius");
        const x01 = 0;
        const y01 = -subRadius;

        const x11 = 0;
        const y11 = subRadius;

        const point00 = series.toGlobal({ x: x00, y: y00 });
        const point10 = series.toGlobal({ x: x10, y: y10 });

        const point01 = subSeries.toGlobal({ x: x01, y: y01 });
        const point11 = subSeries.toGlobal({ x: x11, y: y11 });

        line0.set("points", [point00, point01]);
        line1.set("points", [point10, point11]);
      }
    }

    const line0 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: am5.color("#ffffff"),
        strokeDasharray: [2, 2],
      
      })
    );
    const line1 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: am5.color("#ffffff"),
        strokeDasharray: [2, 2],
      
      })
    );

    series.data.setAll([
      {
        category: "Lithuania",
        value: 500,
        subData: [
          { category: "A", value: 200 },
          { category: "B", value: 150 },
          { category: "C", value: 100 },
          { category: "D", value: 100 }
        ]
      },
      {
        category: "Czechia",
        value: 300,
        subData: [
          { category: "A", value: 150 },
          { category: "B", value: 60 },
          { category: "C", value: 30 }
        ]
      },
      {
        category: "Ireland",
        value: 200,
        subData: [
          { category: "A", value: 110 },
          { category: "B", value: 60 },
          { category: "C", value: 30 }
        ]
      },
    //   {
    //     category: "Germany",
    //     value: 150,
    //     subData: [
    //       { category: "A", value: 80 },
    //       { category: "B", value: 40 },
    //       { category: "C", value: 30 }
    //     ]
    //   },
    //   {
    //     category: "Australia",
    //     value: 140,
    //     subData: [
    //       { category: "A", value: 90 },
    //       { category: "B", value: 40 },
    //       { category: "C", value: 10 }
    //     ]
    //   },
    //   {
    //     category: "Austria",
    //     value: 120,
    //     subData: [
    //       { category: "A", value: 60 },
    //       { category: "B", value: 30 },
    //       { category: "C", value: 30 }
    //     ]
    //   }
    ]);

    function selectSlice(slice: any) {
      selectedSlice = slice;
      const dataItem = slice.dataItem;
      const dataContext = dataItem.dataContext;

      if (dataContext) {
        let i = 0;
        subSeries.data.each(function(dataObject) {
          const dataObj = dataContext.subData[i];
          if(dataObj){
            if(!subSeries.dataItems[i].get("visible")){
              subSeries.dataItems[i].show();
            }
            subSeries.data.setIndex(i, dataObj);
          }
          else{
            subSeries.dataItems[i].hide();
          }
          i++;
        });
      }

      const middleAngle = slice.get("startAngle") + slice.get("arc") / 2;
      const firstAngle = series.dataItems[0].get("slice").get("startAngle");

      series.animate({
        key: "startAngle",
        to: firstAngle - middleAngle,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic)
      });
      series.animate({
        key: "endAngle",
        to: firstAngle - middleAngle + 360,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic)
      });
    }

    container.appear(1000, 10);

    series.events.on("datavalidated", function() {
      selectSlice(series.slices.getIndex(0));
    });

    return () => {
      root.dispose();
    };
  }, [chartId]);

  return <div id={chartId} style={{ width: "90%", height: "500px",color:"white" }} />;
};

export default PieOfPieChart;