function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMeta = data.metadata.filter(i => i.id == sample);
    console.log(filteredMeta);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result)
    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResult = filteredMeta[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = result.otu_ids;
    var otuLabel = result.otu_labels;
    var sampleValue = result.sample_values;
    console.log(sampleValue.slice(0,10));
    // 3. Create a variable that holds the washing frequency.
    washFreq = parseFloat(metaResult.wfreq);
    console.log(washFreq);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuId.slice(0,10).map((i) => `OTU ID ${i}`)
    //.sort((a,b) => a - b).reverse();
    console.log(yticks.toString().split(","));
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValue.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: yticks,
      hoverinfo: "text"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     margin: {
      t: 50,
      l: 150,
     },
     yaxis: {
      title: "Bacteria ID",
     },
     xaxis: {
      title: "Number of Bacteria Present",
     }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    var bubbleData = [{
      x: otuId,
      y: sampleValue,
      text: otuLabel,
      mode: "markers",
      marker: {
        size: sampleValue,
        color: otuId,
        colorscale: "Jet",
      },
      type: "bubble"
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showLegend: true,
      xaxis: {
        title: "OTU ID"
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10]},
        bar: {color: "white"},
        steps: [
          { range: [0,2], color: "pink"},
          { range: [2,4], color: "red"},
          { range: [4,6], color: "orange"},
          { range: [6,8], color: "yellow"},
          { range: [8,10], color: "green"},
        ],
      },
      title: {text: "Wash Frequency"}
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 550,
      height: 400,
      margin: {
        t: 0,
        b: 0
      },     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
