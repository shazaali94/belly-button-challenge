// Define the updateDashboard function
function updateDashboard(selectedIndex, data) {
    // Update sample metadata display
    const sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");
    sampleMetadata.append("h2").text("Sample Metadata");
  
    // Assuming your JSON data has a "metadata" field that contains demographic information
    const metadata = data.metadata[selectedIndex]; // Use the selected index
  
    // Loop through the metadata and append each key-value pair to the sampleMetadata div
    for (const [key, value] of Object.entries(metadata)) {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    }
  
    // Update bubble chart (using Plotly)
    const bubbleChart = document.getElementById("bubble");
    const bubbleData = [{
      x: data.samples[selectedIndex].otu_ids,
      y: data.samples[selectedIndex].sample_values,
      text: data.samples[selectedIndex].otu_labels,
      mode: "markers",
      marker: {
        size: data.samples[selectedIndex].sample_values,
        color: data.samples[selectedIndex].otu_ids,
        colorscale: "Viridis",
        opacity: 0.6
      }
    }];
  
    const bubbleLayout = {
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest"
    };
  
    Plotly.newPlot(bubbleChart, bubbleData, bubbleLayout);
  
    // Update bar chart (using Plotly)
    const barChart = document.getElementById("bar");
    const top10Data = data.samples[selectedIndex].sample_values.slice(0, 10).reverse();
    const top10Labels = data.samples[selectedIndex].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    const barData = [{
      x: top10Data,
      y: top10Labels,
      type: "bar",
      orientation: "h"
    }];
  
    const barLayout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
  
    Plotly.newPlot(barChart, barData, barLayout);
  }
  
  // Initialize function to set up the initial chart
  function init(data) {
    // Set the default selected index (e.g., 0 for the first individual)
    const defaultIndex = 0;
  
    // Call the updateDashboard function to display the initial data
    updateDashboard(defaultIndex, data);
  }
  
  // Load the JSON data and call the init function when the page loads
  document.addEventListener("DOMContentLoaded", function() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
      .then(function(data) {
        // Create the dropdown options
        const dropdown = d3.select("#selDataset");
        dropdown.selectAll("option")
          .data(data.names)
          .enter()
          .append("option")
          .attr("value", (d, i) => i)
          .text((d, i) => `${d}`);
  
        // Call the init function to set up the initial chart
        init(data);
  
        // Event listener for dropdown change
        dropdown.on("change", function() {
          const selectedIndex = this.value;
          updateDashboard(selectedIndex, data);
        });
      });
  });
  