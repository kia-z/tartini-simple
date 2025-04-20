// Fetching data from Google Sheets and transforming it into a format suitable for visualization
// This function fetches data from various Google Sheets and transforms it into nodes and links for network graph visualization
async function fetchGraphData(targetId = null) {
    const peopleRes = await fetch(`https://script.google.com/macros/s/AKfycbyBBRlu5qk8SgG-QJhAhriKSLwLh7HJ4DH5KmUyLc2aggftNvHyB3LOKNqQC0CM2cNB3w/exec?action=get_all_people`, {
        method: "GET"  });
    const peopleData = await peopleRes.json(); 
    
    const activitiesRes = await fetch(`https://script.google.com/macros/s/AKfycbyBBRlu5qk8SgG-QJhAhriKSLwLh7HJ4DH5KmUyLc2aggftNvHyB3LOKNqQC0CM2cNB3w/exec?action=get_all_activities`, {
        method: "GET"  });
    const activitiesData = await activitiesRes.json();
    
    const worksRes = await fetch(`https://script.google.com/macros/s/AKfycbyBBRlu5qk8SgG-QJhAhriKSLwLh7HJ4DH5KmUyLc2aggftNvHyB3LOKNqQC0CM2cNB3w/exec?action=get_all_works`, {
        method: "GET"  });
    const worksData = await worksRes.json();
    
    const placesRes = await fetch(`https://script.google.com/macros/s/AKfycbyBBRlu5qk8SgG-QJhAhriKSLwLh7HJ4DH5KmUyLc2aggftNvHyB3LOKNqQC0CM2cNB3w/exec?action=get_all_places`, {
        method: "GET"  });
    const placesData = await placesRes.json();
    
    const linksRes = await fetch(`https://script.google.com/macros/s/AKfycbyBBRlu5qk8SgG-QJhAhriKSLwLh7HJ4DH5KmUyLc2aggftNvHyB3LOKNqQC0CM2cNB3w/exec?action=get_all_relations`, {
        method: "GET"  });
    const linksData = await linksRes.json();
    console.log("linksData:", linksData);
    
    function sheetToNodes(rows, type) {
      if (!Array.isArray(rows) || !Array.isArray(rows[0])) return [];
      const [header, ...data] = rows[0]; 
      return data.map(row => {
        const obj = {};
        header.forEach((key, i) => {
          obj[key] = row[i];
        });
        return {
          id: obj.person_name || obj.activity_title || obj.work_title || obj.place_name || obj.id,
          label: obj.person_name || obj.activity_title || obj.work_title || obj.place_name || "Unnamed",
          type: type,
          raw: obj
        };
      });
    }
    
    const nodes = [
      ...sheetToNodes(peopleData, "person"),
      ...sheetToNodes(activitiesData, "activity"),
      ...sheetToNodes(worksData, "work"),
      ...sheetToNodes(placesData, "place")
    ];
    
    function sheetToLinks(rows) {
      if (!Array.isArray(rows) || !Array.isArray(rows[0])) return [];
      const [header, ...data] = rows[0]; 
      return data.map(row => {
        const obj = {};
        header.forEach((key, i) => {
          obj[key] = row[i];
        });
        return {
          source: obj.relation_source_id,
          target: obj.relation_target_id,
          label: obj.relation_type
        };
      });
    }
    
     const links = sheetToLinks(linksData);
    
      console.log("NODES:", nodes);
      console.log("LINKS:", links);
    
      
      const factoidRes = await fetch(`https://script.google.com/macros/s/AKfycbyBBRlu5qk8SgG-QJhAhriKSLwLh7HJ4DH5KmUyLc2aggftNvHyB3LOKNqQC0CM2cNB3w/exec?action=get_all_factoids`, {
          method: "GET"
          })
      const factoidData = await factoidRes.json();
    
    
      function sheetToFactoidNodes(rows) {
      if (!Array.isArray(rows) || !Array.isArray(rows[0])) return [];
    
      const [header, ...data] = rows;
    
      return data.map((row, index) => {
        const obj = {};
        header.forEach((key, i) => {
          obj[key] = row[i];
        });
    
        return {
          id: `factoid_${index}`, // Unique ID for the factoid node
          type: "factoid",
          label: `${obj.factoid_date_from || ""} ${obj.factoid_notes || ""}`.trim(),
          raw: obj
        };
      });
    }
    
    function sheetToFactoidLinks(rows) {
      if (!Array.isArray(rows) || !Array.isArray(rows[0])) return [];
    
      const [header, ...data] = rows;
    
      return data.flatMap((row, index) => {
        const obj = {};
        header.forEach((key, i) => {
          obj[key] = row[i];
        });
    
        const factoidId = `factoid_${index}`;
    
        return [
          {
            source: obj.factoid_source_id,
            target: factoidId,
            label: obj.factoid_relationship_type || "factoid-link"
          },
          {
            source: factoidId,
            target: obj.factoid_target_id,
            label: obj.factoid_relationship_type || "factoid-link"
          }
        ];
      });
    }
    
    const factoidNodes = sheetToFactoidNodes(factoidData);
    const factoidLinks = sheetToFactoidLinks(factoidData);
    
    console.log("FACTOID NODES:", factoidNodes);
    console.log("FACTOID LINKS:", factoidLinks);
    
      return {
        nodes: [...nodes, ...factoidNodes],
        links: [...links, ...factoidLinks]
      };
    }
    