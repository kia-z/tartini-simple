function renderGraph(nodes, links) {
  const width = 800;
  const height = 600;

  const svg = d3.select("#knowledgeGraph")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

  svg.selectAll("*").remove(); // clear old graph if any

  // Create a zoomable container
  const zoomLayer = svg.append("g").attr("class", "zoom-layer");

  svg.call(
    d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        zoomLayer.attr("transform", event.transform);
      })
  );

  // Set up simulation
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Draw links
  const linkGroup = zoomLayer.append("g").attr("class", "links");
  const link = linkGroup.selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", "#aaa");

  // Draw link labels
  const linkLabelGroup = zoomLayer.append("g").attr("class", "link-labels");
  const linkLabels = linkLabelGroup.selectAll("text")
    .data(links)
    .join("text")
    .attr("font-size", 10)
    .attr("fill", "#555")
    .attr("text-anchor", "middle")
    .text(d => d.label || "");

  // Draw nodes
  const nodeGroup = zoomLayer.append("g").attr("class", "nodes");
  const node = nodeGroup.selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 8)
    .attr("fill", d => {
      const colors = {
        person: "#4f81bd",
        activity: "#f79646",
        work: "#93c47d",
        place: "#b4a7d6",
        factoid: "#ddd"
      };
      return colors[d.type] || "#999";
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
    );

  // Draw node labels
  const textGroup = zoomLayer.append("g").attr("class", "labels");
  const labels = textGroup.selectAll("text")
    .data(nodes)
    .join("text")
    .text(d => d.label || d.id)
    .attr("font-size", 10)
    .attr("dx", 12)
    .attr("dy", 4);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    labels
      .attr("x", d => d.x)
      .attr("y", d => d.y);

    linkLabels
      .attr("transform", d => {
        const x = (d.source.x + d.target.x) / 2;
        const y = (d.source.y + d.target.y) / 2;
        const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180 / Math.PI;
        return `translate(${x},${y}) rotate(${angle})`;
      });
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
fetchGraphData()
  .then(({ nodes, links }) => {
    const nodeIds = new Set(nodes.map(n => n.id));
    const safeLinks = links.filter(link =>
      nodeIds.has(link.source) && nodeIds.has(link.target)
    );
    renderGraph(nodes, safeLinks);
  })
  .catch(err => console.error("Error loading graph data:", err));
