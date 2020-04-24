// Function for pulling in data using d3
function getPlot(id) {
    // getting data from the json file
    d3.json("/StarterCode/samples.json").then((data) => {
        console.log(data)

        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)

        // Filter sample by ID
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);

        // Slice the top 10 values
        var samplevalues = samples.sample_values.slice(0, 10).reverse();

        // Top 10 OTU IDs for plots
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();

        // Configure map OTU ID's into form for plot
        var OTU_id = OTU_top.map(d => "OTU " + d)

        // Get top 10 labels for plot
        var labels = samples.otu_labels.slice(0, 10);


        // Trace for horizontal bar chart
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'rgba(0, 255, 36, 1)'
            },
            type: "bar",
            orientation: "h",
        };

        // Trace data
        var data = [trace];

        // Plot layout
        var layout = {
            title: "10 Most Common OTU's",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 20
            }
        };

        // Generate bar plot
        Plotly.newPlot("bar", data, layout);

        // Bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // Bubble chart layout
        var layout_b = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        // Trace data
        var data1 = [trace1];

        // Bubble chart plot
        Plotly.newPlot("bubble", data1, layout_b);

        // Create gauge chart layout

        var data_g = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: `Washing Frequency (Weekly)` },
            type: "indicator",

            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "cyan" },
                    { range: [4, 6], color: "teal" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "green" },
                ]
            }

        }];
        var layout_g = {
            width: 700,
            height: 600,
            margin: { t: 20, b: 40, l: 100, r: 100 }
        };
        Plotly.newPlot("gauge", data_g, layout_g);
    });
}
// Function to get data
function getInfo(id) {
    // read in samples.json
    d3.json("StarterCode/samples.json").then((data) => {

        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");

        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("/StarterCode/samples.json").then((data) => {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();