// filepath: c:\Users\Abhinav\Desktop\Kurjhan\flow1gojs\family-tree\src\main.js
import * as go from 'gojs';
import abhinav from "./assets/abhi.png"
const nameProperty = 'name';
const genderProperty = 'gender';
const statusProperty = 'status';
const countProperty = 'count';

const theme = {
  colors: {
    femaleBadgeBackground: '#d7c2f7ff',         // Soft lavender
    maleBadgeBackground: '#27436cff',           // Soft blue
    femaleBadgeText: '#3b0764',               // Deep purple
    maleBadgeText: '#f5f5f5ff',                 // Navy blue

    kingQueenBorder: '#fbbf24',               // Amber
    princePrincessBorder: '#60a5fa',          // Sky blue
    civilianBorder: '#34d399',               //

    personText: '#1e293b',                   
    personNodeBackground: '#f1f5f9',          
    selectionStroke: '#7c3aed',               

    counterBackground: '#475569',             
    counterBorder: '#64748b',                
    counterText: '#f1f5f9',                   

    link: '#ffffffff'                           
  },
  fonts: {
    badgeFont: '600 12px Poppins',
    birthDeathFont: '400 13px Poppins',
    nameFont: '600 22px Poppins',
    counterFont: '500 18px Poppins'
  },

  linkStyle: {
    strokeWidth: 10,     // visible line width
    strokeDashArray: null
  }
};





  // toggle highlight on mouse enter/leave
  // this sample also uses highlight for selection, so only unhighlight if unselected
  const onMouseEnterPart = (e, part) => part.isHighlighted = true;
  const onMouseLeavePart = (e, part) => { if (!part.isSelected) part.isHighlighted = false; }
  const onSelectionChange = (part) => { part.isHighlighted = part.isSelected; }

  const STROKE_WIDTH = 3;
  const ADORNMENT_STROKE_WIDTH = STROKE_WIDTH + 1;
  const CORNER_ROUNDNESS = 12;
  const IMAGE_TOP_MARGIN = 20;
  const MAIN_SHAPE_NAME = 'mainShape';
  const IMAGE_DIAMETER = 40;

  const getStrokeForStatus = (status) => {
    switch (status) {
      case 'king':
      case 'queen':
        return theme.colors.kingQueenBorder;
      case 'prince':
      case 'princess':
        return theme.colors.princePrincessBorder;
      case 'civilian':
      default:
        return theme.colors.civilianBorder;
    }
  };

  function strokeStyle(shape) {
    return shape
      .set({
        fill: theme.colors.personNodeBackground,
        strokeWidth: STROKE_WIDTH
      })
      .bind('stroke', statusProperty, status => getStrokeForStatus(status))
      .bindObject('stroke', 'isHighlighted', (isHighlighted, obj) =>
        isHighlighted
          ? theme.colors.selectionStroke
          : getStrokeForStatus(obj.part.data.status))
  }

  const genderToText = (gender) => (gender === 'M' ? 'MALE' : 'FEMALE');

  const genderToTextColor = (gender) =>
    gender === 'M' ? theme.colors.maleBadgeText : theme.colors.femaleBadgeText;

  const genderToFillColor = (gender) =>
    gender === 'M'
      ? theme.colors.maleBadgeBackground
      : theme.colors.femaleBadgeBackground;

  const personBadge = () =>
    new go.Panel('Auto', {
      alignmentFocus: go.Spot.TopRight,
      alignment: new go.Spot(1, 0, -25, STROKE_WIDTH - 0.5)
    })
      .add(
        new go.Shape({
          figure: 'RoundedRectangle',
          parameter1: CORNER_ROUNDNESS,
          parameter2: 4 | 8, // round only the bottom
          desiredSize: new go.Size(NaN, 22.5),
          stroke: null
        })
          .bind('fill', genderProperty, genderToFillColor),
      new go.TextBlock({
        font: theme.fonts.badgeFont
      })
        .bind('stroke', genderProperty, genderToTextColor)
        .bind('text', genderProperty, genderToText)
      )

  const personBirthDeathTextBlock = () =>
    new go.TextBlock({
      stroke: theme.colors.personText,
      font: theme.fonts.birthDeathFont,
      alignmentFocus: go.Spot.Top,
      alignment: new go.Spot(0.5, 1, 0, -35)
    })
      .bind('text', '', ({ born, death }) => {
        if (!born) return '';
        return `${born} - ${death ?? ''}`;
      })

  // Panel to display the number of children a node has
  const personCounter = () =>
    new go.Panel('Auto', {
      visible: false,
      alignmentFocus: go.Spot.Center,
      alignment: go.Spot.Bottom
    })
      .bindObject('visible', '', (obj) => obj.findLinksOutOf().count > 0)
      .add(
        new go.Shape('Circle', {
        desiredSize: new go.Size(29, 29),
        strokeWidth: STROKE_WIDTH,
        stroke: theme.colors.counterBorder,
        fill: theme.colors.counterBackground
      }),
        new go.TextBlock({
        alignment: new go.Spot(0.5, 0.5, 0, 1),
        stroke: theme.colors.counterText,
        font: theme.fonts.counterFont,
        textAlign: 'center'
      })
        .bindObject('text', '', (obj) => obj.findNodesOutOf().count)
      )

  function pictureStyle(pic) {
    return pic
      .bind('source', '', ({ status, gender }) => {
        switch (status) {
          case 'king':
          case 'queen':
            return './images/king.svg';
          case 'prince':
          case 'princess':
            return './images/prince.svg';
          case 'civilian':
            return gender === 'M'
              ? './images/male-civilian.svg'
              : './images/female-civilian.svg';
          default:
            return './images/male-civilian.svg';
        }
      })
      // The SVG files are different sizes, so this keeps their aspect ratio reasonable
      .bind('desiredSize', 'status', status => {
        switch (status) {
          case 'king':
          case 'queen':
            return new go.Size(30, 20)
          case 'prince':
          case 'princess':
            return new go.Size(28, 20)
          case 'civilian':
          default:
            return new go.Size(24, 24)
        }
      });
  }

  const personImage = () =>
  new go.Picture({
    margin: new go.Margin(10, 0, 0, 0),
    desiredSize: new go.Size(48, 48),
    imageStretch: go.ImageStretch.UniformToFill
  })
    .bind('source', 'picture');

const personDescriptionTextBlock = () =>
  new go.TextBlock({
    stroke: theme.colors.personText,
    font: '14px Poppins',
    margin: new go.Margin(4, 0, 0, 0),
    wrap: go.TextBlock.WrapFit,
    maxSize: new go.Size(180, 40),
    textAlign: 'center'
  })
    .bind('text', 'description');

  const personMainShape = () =>
    new go.Shape({
      figure: 'RoundedRectangle',
      desiredSize: new go.Size(215, 110),
      portId: '',
      parameter1: CORNER_ROUNDNESS
    })
      .apply(strokeStyle);

  const personNameTextBlock = () =>
    new go.TextBlock({
      stroke: theme.colors.personText,
      font: theme.fonts.nameFont,
      desiredSize: new go.Size(160, 50),
      overflow: go.TextOverflow.Ellipsis,
      textAlign: 'center',
      verticalAlignment: go.Spot.Center,
      toolTip: go.GraphObject.build('ToolTip')
        .add(new go.TextBlock({ margin: 4 }).bind('text', nameProperty)),
      alignmentFocus: go.Spot.Top,
      alignment: new go.Spot(0.5, 0, 0, 25)
    })
      .bind('text', nameProperty)


  // Update your node template:
  const createNodeTemplate = () =>
    new go.Node('Spot', {
      selectionAdorned: false,
      mouseEnter: onMouseEnterPart,
      mouseLeave: onMouseLeavePart,
      selectionChanged: onSelectionChange
    })
      .add(
        new go.Panel('Spot')
        .add(
          personMainShape(),
          personNameTextBlock(),
          personBirthDeathTextBlock(),
  
        ),
        personBadge(),
        personCounter()
      )

  const createLinkTemplate = () =>
    new go.Link({
      selectionAdorned: false,
      routing: go.Routing.Orthogonal,
      layerName: 'Background',
      mouseEnter: onMouseEnterPart,
      mouseLeave: onMouseLeavePart
    })
      .add(
        new go.Shape({
          stroke: theme.colors.link,
          strokeWidth: 1
        })
          .bindObject('stroke', 'isHighlighted', (isHighlighted) =>
            isHighlighted ? theme.colors.selectionStroke : theme.colors.link
          )
          .bindObject('stroke', 'isSelected', (selected) =>
            selected ? theme.colors.selectionStroke : theme.colors.link
          )
          .bindObject('strokeWidth', 'isSelected', (selected) => selected ? 2 : 1)
      );


 const initDiagram = (divId) => {
    const diagram = new go.Diagram(divId, {
      layout: new go.TreeLayout({
        angle: 90,
        nodeSpacing: 60,
        layerSpacing: 100,
        layerStyle: go.TreeLayout.LayerUniform,
        // For compaction, make the last parents place their children in a bus
        treeStyle: go.TreeStyle.LastParents,
        alternateAngle: 90,
        alternateLayerSpacing: 35,
        alternateAlignment: go.TreeAlignment.BottomRightBus,
        alternateNodeSpacing: 20
      }),
      scrollMargin: 500, // Adds extra scrollable space around content
      positionComputation: function (diagram, pos) {
        return pos; // Allow unrestricted scrolling
      },
      'toolManager.hoverDelay': 100,
      linkTemplate: createLinkTemplate(),
      model: new go.TreeModel({ nodeKeyProperty: 'name' })
    });

    diagram.nodeTemplate = createNodeTemplate();
    const nodes = familyData;
    diagram.model.addNodeDataCollection(nodes);

    // Initially zoom to fit the diagram
    diagram.addDiagramListener('InitialLayoutCompleted', () => {
      diagram.commandHandler.zoomToFit();
    });

    // Setup zoom to fit button
    document.getElementById('zoomToFit').addEventListener('click', () => diagram.commandHandler.zoomToFit());

    document.getElementById('centerRoot').addEventListener('click', () => {
      diagram.scale = 1;
      diagram.commandHandler.scrollToPart(diagram.findNodeForKey('King George V'));
    });

    diagram.addDiagramListener('ChangedSelection', function(e) {
      const node = diagram.selection.first();
      const infoDiv = document.getElementById('personDetails');
      const personInfo = document.getElementById('personInfo');
      if (node && node.data) {
        showPersonInfo();
        const d = node.data;
        infoDiv.innerHTML = `
          <img src="${d.picture || './images/default.jpg'}" alt="${d.name}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin-bottom:10px;"><br>
          <strong>Name:</strong> ${d.name}<br>
          <strong>Gender:</strong> ${d.gender === 'M' ? 'Male' : 'Female'}<br>
          <strong>Description:</strong> ${d.description || '-'}<br>
          <strong>Born:</strong> ${d.born || '-'}<br>
          <strong>Died:</strong> ${d.death || '-'}<br>
          <strong>Parent:</strong> ${d.parent || '-'}
        `;
      } else {
        infoDiv.innerHTML = 'Click a node to see details.';
        if (personInfo) personInfo.classList.remove('open');
      }
    });

    function setupSearch(diagram) {
      const searchBox = document.getElementById('searchBox');
      const searchBtn = document.getElementById('searchBtn');

      function searchAndFocus() {
        const name = searchBox.value.trim();
        if (!name) return;
        const node = diagram.findNodeForKey(name);
        if (node) {
          diagram.select(node);
          diagram.centerRect(node.actualBounds);
          diagram.scrollToRect(node.actualBounds);
          node.isSelected = true;
        } else {
          alert('No node found with that name.');
        }
      }

      searchBtn.addEventListener('click', searchAndFocus);
      searchBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchAndFocus();
      });
    }

    // Call this at the end of initDiagram:
    setupSearch(diagram);
};

// Show person info when a node is selected
function showPersonInfo() {
  const personInfo = document.getElementById('personInfo');
  if (personInfo) personInfo.classList.add('open');
}

// Hide person info and clear selection when close button is clicked
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closePersonInfo');
  const personInfo = document.getElementById('personInfo');
  closeBtn.addEventListener('click', () => {
    personInfo.classList.remove('open');
    // Clear selection in diagram if available
    const diagram = go.Diagram.fromDiv(document.getElementById('myDiagramDiv'));
    if (diagram) diagram.clearSelection();
  });
});

  const familyData = [
    {
      name: 'Ukhou ji',
      gender: 'M', status: '', born: '', death: '', description: "",
      // no parent value, this is the root
    },
    {
      name: 'Khaam Ji',
      gender: 'M', status: '', born: '', death: '',
      parent: 'Ukhou ji'
    },
    {
      name: 'Baav ji',
      gender: 'M', status: '', born: '', death: '',
      parent: 'Khaam Ji'
    },
    {
      name: 'Maloop ji',
      gender: 'M',
      parent: 'Baav ji'
    },
    {
      name: 'Salop ji',
      gender: 'M',
      parent: 'Baav ji'
    },
    {
      name: 'Kripalu',
      gender: 'M',
      parent: 'Maloop ji'
    },
    {
      name: 'Prahlad',
      gender: 'M',
      parent: 'Maloop ji'
    },
    {
      name: 'Jasodhar',
      gender: 'M',
      parent: 'Maloop ji'
    },
    {
      name: 'Hemant',
      gender: 'M', 
      parent: 'Prahlad'
    },
    {
      name: 'Sumant',
      gender: 'M', 
      parent: 'Prahlad'
    },
    {
      name: 'Dhamu ji',
      gender: 'M', 
      parent: 'Jasodhar'
    },
    {
      name: 'Sashidhar',
      gender: 'M', 
      parent: 'Jasodhar'
    },
    {
      name: 'Dillu ram',
      gender: 'M', 
      parent: 'Kripalu'
    },
    {
      name: 'Jgendra',
      gender: 'M', 
      parent: 'Kripalu'
    },
    {
      name: 'Hemchandra',
      gender: 'M',
      parent: 'Kripalu'
    },
    {
      name: 'Chandi das',
      gender: 'M',
      parent: 'Hemchandra'
    },
    {
      name: 'Dineshwar(dinna)',
      gender: 'M',
      parent: 'Hemchandra'
    },
    {
      name: 'Bhaskar',
      gender: 'M', 
      parent: 'Hemchandra'
    },
    {
      name: 'Gangaram',
      gender: 'M',
      parent: 'Bhaskar'
    },
    {
      name: 'Harsh Dev',
      gender: 'M', 
      parent: 'Bhaskar'
    },
    {
      name: 'Ramvaksh',
      gender: 'M',
      parent: 'Bhaskar'
    },
    {
      name: 'Lalita prasad(Latu)',
      gender: 'M', 
      parent: 'Harsh Dev'
    },
    
    {
      name: 'Teekaram',
      gender: 'M',
      parent: 'Harsh Dev'
    },
    {
      name: 'Yugvrati',
      gender: 'M',
      parent: 'Harsh Dev'
    },
    {
      name: 'Kameshwar',
      gender: 'M',
      parent: 'Chandi das'
    },
    {
      name: 'Vamdev',
      gender: 'M', 
      parent: 'Kameshwar'
    },
    {
      name: 'Brijshwar',
      gender: 'M', 
      parent: 'Kameshwar'
    },
    {
      name: 'Ravi ji',
      gender: 'M',
      parent: 'Dineshwar(dinna)'
    },
    {
      name: 'Ajabram',
      gender: 'M',
      parent: 'Ravi ji'
    },
    {
      name: 'Sahajram',
      gender: 'M',
      parent: 'Ravi ji'
    },
    {
      name: 'Rupa',
      gender: 'M', 
      parent: 'Sahajram'
    },
    {
      name: 'Santu',
      gender: 'M', 
      parent: 'Sahajram'
    },
    {
      name: 'Sobha',
      gender: 'M', 
      parent: 'Sahajram'
    },
    {
      name: 'Ballu',
      gender: 'M', 
      parent: 'Sahajram'
    },
    {
      name: 'Dhoora',
      gender: 'M', 
      parent: 'Sahajram'
    },
    {
      name: 'Mukundram',
      gender: 'M', 
      parent: 'Dhoora'
    },
    {
      name: 'Ratiram',
      gender: 'M', 
      parent: 'Dhoora'
    },
    {
      name: 'Madiram',
      gender: 'M', 
      parent: 'Dhoora'
    },
    {
      name: 'Totaram',
      gender: 'M', 
      parent: 'Dhoora'
    },
    {
      name: 'Trilochan',
      gender: 'M', 
      parent: 'Madiram'
    },
    {
      name: 'Anirudh',
      gender: 'M', 
      parent: 'Trilochan'
    },
    {
      name: 'Ashish',
      gender: 'M', 
      parent: 'Anirudh'
    },
    {
      name: 'Tanuj',
      gender: 'M', 
      parent: 'Anirudh'
    },
    {
      name: 'Mitranand',
      gender: 'M', 
      parent: 'Totaram'
    },
    {
      name: 'Satyananad',
      gender: 'M', 
      parent: 'Totaram'
    },
    {
      name: 'Lokanand',
      gender: 'M', 
      parent: 'Totaram'
    },
    {
      name: 'Gajadhar',
      gender: 'M', 
      parent: 'Totaram'
    },
    {
      name: 'Vishambhar',
      gender: 'M', 
      parent: 'Totaram'
    },
    {
      name: 'Bhupesh',
      gender: 'M', 
      parent: 'Gajadhar'
    },
    {
      name: 'Upendra',
      gender: 'M', 
      parent: 'Mitranand'
    },
    {
      name: 'NArendra',
      gender: 'M', 
      parent: 'Mitranand'
    },
    {
      name: 'Mahabir',
      gender: 'M', 
      parent: 'Mitranand'
    },
    {
      name: 'Akhilesh',
      gender: 'M', 
      parent: 'Mahabir'
    },
    {
      name: 'Trisha',
      gender: 'M', 
      parent: 'NArendra'
    },
    {
      name: 'Yogendra',
      gender: 'M', 
      parent: 'Upendra'
    },
    {
      name: 'Mahendra',
      gender: 'M', 
      parent: 'Upendra'
    },
    {
      name: 'Anish',
      gender: 'M', 
      parent: 'Yogendra'
    },




    {
      name: 'Prempati',
      gender: 'M', 
      parent: 'Mukundram'
    },
    {
      name: 'Vachspati',
      gender: 'M', 
      parent: 'Mukundram'
    },
    {
      name: 'Dinesh',
      gender: 'M', 
      parent: 'Vachspati'
    },
    {
      name: 'Neeraj',
      gender: 'M', 
      parent: 'Vachspati'
    },
    {
      name: 'Shubham',
      gender: 'M', 
      parent: 'Neeraj'
    },
    {
      name: 'Pankaj',
      gender: 'M', 
      parent: 'Dinesh'
    },
    {
      name: 'Suman',
      gender: 'M', 
      parent: 'Dinesh'
    },
    {
      name: 'Subodh',
      gender: 'M', 
      parent: 'Dinesh'
    },
    {
      name: 'Aryan',
      gender: 'M', 
      parent: 'Subodh'
    },
    {
      name: 'Abhitanksh',
      gender: 'M', 
      parent: 'Pankaj'
    },
    {
      name: 'RAmkrishn',
      gender: 'M', 
      parent: 'Sobha'
    },






    {
      name: 'Gautam',
      gender: 'M', 
      parent: 'Ajabram'
    },
    {
      name: 'Lachhmu',
      gender: 'M', 
      parent: 'Ajabram'
    },
    {
      name: 'Mangli',
      gender: 'M', 
      parent: 'Ajabram'
    },
    {
      name: 'Purshotam',
      gender: 'M', 
      parent: 'Mangli'
    },
    {
      name: 'Harikrishn',
      gender: 'M', 
      parent: 'Purshotam'
    },
    {
      name: 'Haridutt',
      gender: 'M', 
      parent: 'Purshotam'
    },
    {
      name: 'Loola',
      gender: 'M', 
      parent: 'Purshotam'
    },





    {
      name: 'Kali',
      gender: 'M', 
      parent: 'Ajabram'
    },
    {
      name: 'Jyoti',
      gender: 'M', 
      parent: 'Ajabram'
    },
    {
      name: 'Netram',
      gender: 'M', 
      parent: 'Brijshwar'
    },
    {
      name: 'Sanjay(Sauju)',
      gender: 'M', 
      parent: 'Brijshwar'
    },
    {
      name: 'Thelu',
      gender: 'M', 
      parent: 'Brijshwar'
    },
    {
      name: 'Chaitram',
      gender: 'M', 
      parent: 'Brijshwar'
    },
    {
      name: 'Rameshwar',
      gender: 'M', 
      parent: 'Brijshwar'
    },
    {
      name: 'Saunu',
      gender: 'M',
      parent: 'Vamdev'
    },
    {
      name: 'Kedardutt',
      gender: 'M',
      parent: 'Saunu'
    },
    {
      name: 'Lalmani',
      gender: 'M',
      parent: 'Kedardutt'
    },
    {
      name: 'Devkinanad',
      gender: 'M',
      parent: 'Lalmani'
    },
    {
      name: 'Shivkumar',
      gender: 'M',
      parent: 'Devkinanad'
    },
    {
      name: 'Brahmanand',
      gender: 'M',
      parent: 'Kedardutt'
    },
    {
      name: 'Brijmohan',
      gender: 'M',
      parent: 'Brahmanand'
    },
    {
      name: 'Madan',
      gender: 'M',
      parent: 'Brahmanand'
    },
    {
      name: 'Shankar',
      gender: 'M',
      parent: 'Brahmanand'
    },
    {
      name: 'Mohan',
      gender: 'M',
      parent: 'Brahmanand'
    },
    {
      name: 'Shanti',
      gender: 'M',
      parent: 'Brahmanand'
    },










    {
      name: 'Gyani',
      gender: 'M',
      parent: 'Vamdev'
    },
    {
      name: 'Deva',
      gender: 'M',
      parent: 'Vamdev'
    },
    {
      name: 'Girdhar',
      gender: 'M',
      parent: 'Deva'
    },
    {
      name: 'Shreenand',
      gender: 'M',
      parent: 'Girdhar'
    },
    {
      name: 'Shivcharan',
      gender: 'M',
      parent: 'Shreenand'
    },
    {
      name: 'Gopal',
      gender: 'M',
      parent: 'Shreenand'
    },
    {
      name: 'Narendra',
      gender: 'M',
      parent: 'Shreenand'
    },
    {
      name: 'Nandkishor',
      gender: 'M',
      parent: 'Narendra'
    },
    {
      name: 'Yugal',
      gender: 'M',
      parent: 'Nandkishor'
    },
    {
      name: 'Sanjay',
      gender: 'M',
      parent: 'Gopal'
    },
    {
      name: 'Akshat',
      gender: 'M',
      parent: 'Sanjay'
    },
    {
      name: 'Abhinav',
      gender: 'M',
      parent: 'Sanjay'
    },
    {
      name: 'Devsharan',
      gender: 'M',
      parent: 'Shivcharan'
    },
    {
      name: 'Ashutosh',
      gender: 'M',
      parent: 'Devsharan'
    },
    {
      name: 'Vedprakash',
      gender: 'M',
      parent: 'Devsharan'
    },
    {
      name: 'Vijyakrishna',
      gender: 'M',
      parent: 'Devsharan'
    },
    {
      name: 'Vinayak',
      gender: 'M',
      parent: 'Ashutosh'
    },








    {
      name: 'Ratti',
      gender: 'M',
      parent: 'Vamdev'
    },
    {
      name: 'Bhadram',
      gender: 'M',
      parent: 'Netram'
    },
    {
      name: 'Villeshwar',
      gender: 'M',
      parent: 'Netram'
    },
    {
      name: 'Parmanand',
      gender: 'M',
      parent: 'Netram'
    },
    {
      name: 'Ramkrishn',
      gender: 'M',
      parent: 'Netram'
    },
    {
      name: 'Jeetaram',
      gender: 'M',
      parent: 'Netram'
    },
    {
      name: 'Shree Krishn',
      gender: 'M',
      parent: 'Ramkrishn'
    },
    {
      name: 'Jogshwar',
      gender: 'M',
      parent: 'Villeshwar'
    },
    {
      name: 'Bageshwar',
      gender: 'M',
      parent: 'Villeshwar'
    },
    {
      name: 'Visheshwar',
      gender: 'M',
      parent: 'Jogshwar'
    },
    {
      name: 'Kamleshwar',
      gender: 'M',
      parent: 'Jogshwar'
    },
    {
      name: 'Ram Prasad',
      gender: 'M',
      parent: 'Jogshwar'
    },
    {
      name: 'Tulsiram(Shastri)',
      gender: 'M',
      parent: 'Bageshwar'
    },
    {
      name: 'Baliram(Havaldar)',
      gender: 'M',
      parent: 'Bageshwar'
    },
    {
      name: 'Vidyadutt',
      gender: 'M',
      parent: 'Bageshwar'
    },
    {
      name: 'Dayaram',
      gender: 'M',
      parent: 'Bageshwar'
    },
    {
      name: 'Deveshwar',
      gender: 'M',
      parent: 'Tulsiram(Shastri)'
    },
    {
      name: 'Prabhudutt',
      gender: 'M',
      parent: 'Vidyadutt'
    },
    {
      name: 'Anil',
      gender: 'M',
      parent: 'Prabhudutt'
    },
    {
      name: 'Deepak',
      gender: 'M',
      parent: 'Prabhudutt'
    },
    {
      name: 'Shashank',
      gender: 'M',
      parent: 'Prabhudutt'
    },
    {
      name: 'Dharmanand',
      gender: 'M',
      parent: 'Dayaram'
    },
    {
      name: 'Revati nand',
      gender: 'M',
      parent: 'Dayaram'
    },
    {
      name: 'Swadesh',
      gender: 'M',
      parent: 'Revati nand'
    },
    {
      name: 'Suryansh',
      gender: 'M',
      parent: 'Swadesh'
    },
    {
      name: 'Kamroop',
      gender: 'M',
      parent: 'Sanjay(Sauju)'
    },
    {
      name: 'Sangram',
      gender: 'M',
      parent: 'Sanjay(Sauju)'
    },
    {
      name: 'Jeevram',
      gender: 'M',
      parent: 'Kamroop'
    },
    {
      name: 'Fatehram',
      gender: 'M',
      parent: 'Sangram'
    },
    {
      name: 'Hanshram',
      gender: 'M',
      parent: 'Sangram'
    },
    {
      name: 'Rudridutt',
      gender: 'M',
      parent: 'Sangram'
    },
    {
      name: 'Bastiram',
      gender: 'M',
      parent: 'Fatehram'
    },
    {
      name: 'Gajaghar',
      gender: 'M',
      parent: 'Fatehram'
    },
    {
      name: 'Mathura Prasad',
      gender: 'M',
      parent: 'Fatehram'
    },
    {
      name: 'Mahadev prasad',
      gender: 'M',
      parent: 'Mathura Prasad'
    },
    {
      name: 'Bhagwati',
      gender: 'M',
      parent: 'Mathura Prasad'
    },
    {
      name: 'Chandramohan',
      gender: 'M',
      parent: 'Mathura Prasad'
    },
    {
      name: 'Ankur',
      gender: 'M',
      parent: 'Mahadev prasad'
    },
    {
      name: 'Ayush',
      gender: 'M',
      parent: 'Bhagwati'
    },
    {
      name: 'Om',
      gender: 'M',
      parent: 'Chandramohan'
    },
    {
      name: 'Devendra',
      gender: 'M',
      parent: 'Gajaghar'
    },
    {
      name: 'Naveen',
      gender: 'M',
      parent: 'Gajaghar'
    },
    {
      name: 'Devanshu',
      gender: 'M',
      parent: 'Devendra'
    },
    {
      name: 'Brijmohan',
      gender: 'M',
      parent: 'Bastiram'
    },
    {
      name: 'Anshul',
      gender: 'M',
      parent: 'Brijmohan2'
    },
    {
      name: 'Indradev',
      gender: 'M',
      parent: 'Jgendra'
    },
    {
      name: 'Gudadu(Govardhan)',
      gender: 'M',
      parent: 'Indradev'
    },
    {
      name: 'Siddhi',
      gender: 'M',
      parent: 'Gudadu(Govardhan)'
    },
    {
      name: 'Buddhi',
      gender: 'M',
      parent: 'Gudadu(Govardhan)'
    },
    {
      name: 'Ramdutt',
      gender: 'M',
      parent: 'Gudadu(Govardhan)'
    },
    {
      name: 'Amardev',
      gender: 'M',
      parent: 'Gudadu(Govardhan)'
    },
    {
      name: 'jyoti2',
      gender: 'M',
      parent: 'Amardev'
    },
    {
      name: 'Tungiram',
      gender: 'M',
      parent: 'Siddhi'
    },
    {
      name: 'Dhaniram',
      gender: 'M',
      parent: 'Siddhi'
    },
    {
      name: 'Madhavanand',
      gender: 'M',
      parent: 'Dhaniram'
    },
    {
      name: 'Shambhuprasad',
      gender: 'M',
      parent: 'Madhavanand'
    },
    {
      name: 'Alok',
      gender: 'M',
      parent: 'Shambhuprasad'
    },{
      name: 'Amod',
      gender: 'M',
      parent: 'Shambhuprasad'
    },
    {
      name: 'Alochan',
      gender: 'M',
      parent: 'Shambhuprasad'
    },
    {
      name: 'Shivansh',
      gender: 'M',
      parent: 'Alochan'
    },
    {
      name: 'Dakshesh',
      gender: 'M',
      parent: 'Amod'
    },
    {
      name: 'Ramkrishna',
      gender: 'M',
      parent: 'Tungiram'
    },
    {
      name: 'Shiv Prasad Purohit',
      gender: 'M',
      parent: 'Ramkrishna'
    },
    {
      name: 'Sashidharr',
      gender: 'M',
      parent: 'Ramkrishna'
    },
    {
      name: 'Umesh',
      gender: 'M',
      parent: 'Sashidharr'
    },
    {
      name: 'Aarav',
      gender: 'M',
      parent: 'Umesh'
    },
    {
      name: 'Ashutosh(nandi)',
      gender: 'M',
      parent: 'Shiv Prasad Purohit'
    },
    {
      name: 'Aanand(chandi)',
      gender: 'M',
      parent: 'Shiv Prasad Purohit'
    },
    {
      name: 'Abhinav(abu)',
      gender: 'M',picture: abhinav,
      parent: 'Ashutosh(nandi)'
    },
    {
      name: 'Aanchal',
      gender: 'F',
      parent: 'Ashutosh(nandi)'
    },
    {
      name: 'ANshul',
      gender: 'M',
      parent: 'Aanand(chandi)'
    },
    {
      name: 'Aditi',
      gender: 'F',
      parent: 'Aanand(chandi)'
    },
    

    
    
    
    
    
    
    
  ];


  window.addEventListener('DOMContentLoaded', () => {
    // setTimeout only to ensure font is loaded before loading diagram
    // you may want to use an asset loading library for this
    // to keep this sample simple, it does not
    setTimeout(() => {
      initDiagram('myDiagramDiv');
    }, 300);
  });