import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { Minus, Plus, RotateCcw, User, Briefcase, Search, Download, Filter, X, Info } from "lucide-react";

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
import * as d3 from 'd3';

// Node types
type NodeType = "executive" | "manager" | "employee" | "connector" | "department";
type DepartmentType = "executive" | "operations" | "marketing" | "engineering" | "finance" | "hr";

// Node and link interfaces
interface Node {
  id: string;
  name: string;
  title?: string;
  department: DepartmentType;
  type: NodeType;
  avatar?: string;
  email?: string;
  phone?: string;
  location?: string;
  startDate?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  level?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  type?: "reports-to" | "department";
}

// Department colors
const DEPARTMENT_COLORS = {
  "executive": "#3b82f6", 
  "operations": "#f59e0b", 
  "marketing": "#ec4899", 
  "engineering": "#10b981", 
  "finance": "#6366f1",    
  "hr": "#8b5cf6"          
};

// Department names for display
const DEPARTMENT_NAMES = {
  "executive": "Executive",
  "operations": "Operations",
  "marketing": "Marketing",
  "engineering": "Engineering",
  "finance": "Finance",
  "hr": "Human Resources"
};

// Avatar placeholders 
const AVATARS = {
  ceo: "/api/placeholder/150/150",
  coo: "/api/placeholder/150/150",
  cmo: "/api/placeholder/150/150",
  cto: "/api/placeholder/150/150", 
  cfo: "/api/placeholder/150/150",
  hr_director: "/api/placeholder/150/150",
  ops_manager1: "/api/placeholder/150/150",
  ops_manager2: "/api/placeholder/150/150",
  marketing_manager: "/api/placeholder/150/150",
  marketing_specialist1: "/api/placeholder/150/150",
  marketing_specialist2: "/api/placeholder/150/150",
  engineering_manager: "/api/placeholder/150/150",
  engineer1: "/api/placeholder/150/150",
  engineer2: "/api/placeholder/150/150",
  engineer3: "/api/placeholder/150/150",
  finance_manager: "/api/placeholder/150/150",
  accountant1: "/api/placeholder/150/150",
  accountant2: "/api/placeholder/150/150",
  hr_manager: "/api/placeholder/150/150",
  hr_specialist: "/api/placeholder/150/150"
};

const nodes: Node[] = [
  // Executive level
  { 
    id: 'ceo', 
    name: 'C. Montgomery Burns', 
    title: 'Chief Executive Officer',
    department: 'executive',
    type: 'executive',
    avatar: AVATARS.ceo,
    level: 1,
    email: 'cmonty@burns.com',
    phone: '(555) 123-4567',
    location: 'HQ - Floor 5',
    startDate: '1985-05-12'
  },
  { 
    id: 'coo', 
    name: 'Homer Simpson', 
    title: 'Chief Operations Officer', 
    department: 'operations',
    type: 'executive',
    avatar: AVATARS.coo,
    level: 2,
    email: 'homer@burns.com',
    phone: '(555) 123-4568',
    location: 'HQ - Floor 4',
    startDate: '1989-12-17'
  },
  { 
    id: 'cmo', 
    name: 'Marge Simpson', 
    title: 'Chief Marketing Officer', 
    department: 'marketing',
    type: 'executive',
    avatar: AVATARS.cmo,
    level: 2,
    email: 'marge@burns.com',
    phone: '(555) 123-4569',
    location: 'HQ - Floor 4',
    startDate: '1990-03-22'
  },
  { 
    id: 'cto', 
    name: 'Professor Frink', 
    title: 'Chief Technology Officer', 
    department: 'engineering',
    type: 'executive',
    avatar: AVATARS.cto,
    level: 2,
    email: 'frink@burns.com',
    phone: '(555) 123-4570',
    location: 'HQ - Floor 4',
    startDate: '1992-10-05'
  },
  { 
    id: 'cfo', 
    name: 'Waylon Smithers', 
    title: 'Chief Financial Officer', 
    department: 'finance',
    type: 'executive',
    avatar: AVATARS.cfo,
    level: 2,
    email: 'smithers@burns.com',
    phone: '(555) 123-4571',
    location: 'HQ - Floor 4',
    startDate: '1987-07-15'
  },
  { 
    id: 'hr_director', 
    name: 'Ned Flanders', 
    title: 'HR Director', 
    department: 'hr',
    type: 'executive',
    avatar: AVATARS.hr_director,
    level: 2,
    email: 'ned@burns.com',
    phone: '(555) 123-4572',
    location: 'HQ - Floor 4',
    startDate: '1993-06-01'
  },
  
  // Department Heads (Managers)
  { 
    id: 'ops_manager1', 
    name: 'Lenny Leonard', 
    title: 'Operations Manager', 
    department: 'operations',
    type: 'manager',
    avatar: AVATARS.ops_manager1,
    level: 3,
    email: 'lenny@burns.com',
    phone: '(555) 123-4573',
    location: 'Plant - Section 7G',
    startDate: '1995-03-18'
  },
  { 
    id: 'ops_manager2', 
    name: 'Carl Carlson', 
    title: 'Safety Manager', 
    department: 'operations',
    type: 'manager',
    avatar: AVATARS.ops_manager2,
    level: 3,
    email: 'carl@burns.com',
    phone: '(555) 123-4574',
    location: 'Plant - Safety Office',
    startDate: '1995-03-20'
  },
  { 
    id: 'marketing_manager', 
    name: 'Krusty the Clown', 
    title: 'Marketing Manager', 
    department: 'marketing',
    type: 'manager',
    avatar: AVATARS.marketing_manager,
    level: 3,
    email: 'krusty@burns.com',
    phone: '(555) 123-4575',
    location: 'Marketing Building',
    startDate: '1998-08-10'
  },
  { 
    id: 'engineering_manager', 
    name: 'Lisa Simpson', 
    title: 'Engineering Manager', 
    department: 'engineering',
    type: 'manager',
    avatar: AVATARS.engineering_manager,
    level: 3,
    email: 'lisa@burns.com',
    phone: '(555) 123-4576',
    location: 'R&D Building',
    startDate: '2015-05-25'
  },
  { 
    id: 'finance_manager', 
    name: 'Apu Nahasapeemapetilon', 
    title: 'Finance Manager', 
    department: 'finance',
    type: 'manager',
    avatar: AVATARS.finance_manager,
    level: 3,
    email: 'apu@burns.com',
    phone: '(555) 123-4577',
    location: 'HQ - Floor 3',
    startDate: '1999-11-12'
  },
  { 
    id: 'hr_manager', 
    name: 'Moe Szyslak', 
    title: 'HR Manager', 
    department: 'hr',
    type: 'manager',
    avatar: AVATARS.hr_manager,
    level: 3,
    email: 'moe@burns.com',
    phone: '(555) 123-4578',
    location: 'HQ - Floor 2',
    startDate: '2001-02-28'
  },
  
  // Employees
  { 
    id: 'marketing_specialist1', 
    name: 'Bart Simpson', 
    title: 'Marketing Specialist', 
    department: 'marketing',
    type: 'employee',
    avatar: AVATARS.marketing_specialist1,
    level: 4,
    email: 'bart@burns.com',
    phone: '(555) 123-4579',
    location: 'Marketing Building',
    startDate: '2018-06-05'
  },
  { 
    id: 'marketing_specialist2', 
    name: 'Edna Krabappel', 
    title: 'Social Media Specialist', 
    department: 'marketing',
    type: 'employee',
    avatar: AVATARS.marketing_specialist2,
    level: 4,
    email: 'edna@burns.com',
    phone: '(555) 123-4580',
    location: 'Marketing Building',
    startDate: '2010-09-15'
  },
  { 
    id: 'engineer1', 
    name: 'Martin Prince', 
    title: 'Senior Engineer', 
    department: 'engineering',
    type: 'employee',
    avatar: AVATARS.engineer1,
    level: 4,
    email: 'martin@burns.com',
    phone: '(555) 123-4581',
    location: 'R&D Building',
    startDate: '2017-01-20'
  },
  { 
    id: 'engineer2', 
    name: 'Milhouse Van Houten', 
    title: 'Software Developer', 
    department: 'engineering',
    type: 'employee',
    avatar: AVATARS.engineer2,
    level: 4,
    email: 'milhouse@burns.com',
    phone: '(555) 123-4582',
    location: 'R&D Building',
    startDate: '2019-03-10'
  },
  { 
    id: 'engineer3', 
    name: 'Comic Book Guy', 
    title: 'Systems Architect', 
    department: 'engineering',
    type: 'employee',
    avatar: AVATARS.engineer3,
    level: 4,
    email: 'cbg@burns.com',
    phone: '(555) 123-4583',
    location: 'R&D Building',
    startDate: '2008-07-08'
  },
  { 
    id: 'accountant1', 
    name: 'Patty Bouvier', 
    title: 'Senior Accountant', 
    department: 'finance',
    type: 'employee',
    avatar: AVATARS.accountant1,
    level: 4,
    email: 'patty@burns.com',
    phone: '(555) 123-4584',
    location: 'HQ - Floor 3',
    startDate: '2005-04-01'
  },
  { 
    id: 'accountant2', 
    name: 'Selma Bouvier', 
    title: 'Financial Analyst', 
    department: 'finance',
    type: 'employee',
    avatar: AVATARS.accountant2,
    level: 4,
    email: 'selma@burns.com',
    phone: '(555) 123-4585',
    location: 'HQ - Floor 3',
    startDate: '2005-04-02'
  },
  { 
    id: 'hr_specialist', 
    name: 'Maggie Simpson', 
    title: 'HR Specialist', 
    department: 'hr',
    type: 'employee',
    avatar: AVATARS.hr_specialist,
    level: 4,
    email: 'maggie@burns.com',
    phone: '(555) 123-4586',
    location: 'HQ - Floor 2',
    startDate: '2022-01-15'
  },
  
  // Department grouping nodes (invisible)
  { 
    id: 'dept_operations', 
    name: 'Operations Department', 
    department: 'operations',
    type: 'department',
    level: 2.5
  },
  { 
    id: 'dept_marketing', 
    name: 'Marketing Department', 
    department: 'marketing',
    type: 'department',
    level: 2.5
  },
  { 
    id: 'dept_engineering', 
    name: 'Engineering Department', 
    department: 'engineering',
    type: 'department',
    level: 2.5
  },
  { 
    id: 'dept_finance', 
    name: 'Finance Department', 
    department: 'finance',
    type: 'department',
    level: 2.5
  },
  { 
    id: 'dept_hr', 
    name: 'Human Resources', 
    department: 'hr',
    type: 'department',
    level: 2.5
  },
];

// Define links between nodes
const links: Link[] = [
  // Reporting structure - Executive level
  { source: 'ceo', target: 'coo', type: 'reports-to' },
  { source: 'ceo', target: 'cmo', type: 'reports-to' },
  { source: 'ceo', target: 'cto', type: 'reports-to' },
  { source: 'ceo', target: 'cfo', type: 'reports-to' },
  { source: 'ceo', target: 'hr_director', type: 'reports-to' },
  
  // Department connections
  { source: 'coo', target: 'dept_operations', type: 'department' },
  { source: 'cmo', target: 'dept_marketing', type: 'department' },
  { source: 'cto', target: 'dept_engineering', type: 'department' },
  { source: 'cfo', target: 'dept_finance', type: 'department' },
  { source: 'hr_director', target: 'dept_hr', type: 'department' },
  
  // Department to managers
  { source: 'dept_operations', target: 'ops_manager1', type: 'reports-to' },
  { source: 'dept_operations', target: 'ops_manager2', type: 'reports-to' },
  { source: 'dept_marketing', target: 'marketing_manager', type: 'reports-to' },
  { source: 'dept_engineering', target: 'engineering_manager', type: 'reports-to' },
  { source: 'dept_finance', target: 'finance_manager', type: 'reports-to' },
  { source: 'dept_hr', target: 'hr_manager', type: 'reports-to' },
  
  // Manager to employees
  { source: 'marketing_manager', target: 'marketing_specialist1', type: 'reports-to' },
  { source: 'marketing_manager', target: 'marketing_specialist2', type: 'reports-to' },
  { source: 'engineering_manager', target: 'engineer1', type: 'reports-to' },
  { source: 'engineering_manager', target: 'engineer2', type: 'reports-to' },
  { source: 'engineering_manager', target: 'engineer3', type: 'reports-to' },
  { source: 'finance_manager', target: 'accountant1', type: 'reports-to' },
  { source: 'finance_manager', target: 'accountant2', type: 'reports-to' },
  { source: 'hr_manager', target: 'hr_specialist', type: 'reports-to' },
];

// Constants for zoom functionality
const ZOOM_INCREMENT = 10;
const MIN_ZOOM = 50;
const MAX_ZOOM = 150;
const RESIZE_DEBOUNCE = 200;

// Physics simulation constants - tuned for stability
const SIMULATION_PARAMS = {
  verticalSpacing: 150,
  horizontalSpacing: 250,
  verticalStrength: 0.1,  
  horizontalStrength: 0.15, 
  departmentSeparation: 0.3,
  linkDistance: {
    "reports-to": 85, 
    "department": 45  
  },
  collideRadius: 45,  
  alpha: 0.1,         
  alphaDecay: 0.02,   
  velocityDecay: 0.4  
};

// Main organizational chart component
const OrganizationalChart: React.FC = () => {
  // State Management
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightedDept, setHighlightedDept] = useState<DepartmentType | null>(null);
  const [filteredDepts, setFilteredDepts] = useState<DepartmentType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const nodesRef = useRef<d3.Selection<SVGGElement, Node, SVGGElement, unknown>>();
  const linksRef = useRef<d3.Selection<SVGPathElement, Link, SVGGElement, unknown>>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  
  // Calculate filtered nodes based on search query and department filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      // Include department nodes
      if (node.type === 'department') return true;
      
      // Apply department filter if any are selected
      const passesDeptFilter = filteredDepts.length === 0 || filteredDepts.includes(node.department);
      
      // Apply search filter if query exists
      const passesSearchFilter = !searchQuery || 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.title && node.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return passesDeptFilter && passesSearchFilter;
    });
  }, [searchQuery, filteredDepts]);
  
  // Calculate filtered links based on filtered nodes
  const filteredLinks = useMemo(() => {
    // Get IDs of filtered nodes
    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    
    return links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    });
  }, [filteredNodes]);
  
  // Get details for selected node
  const selectedNodeDetails = useMemo(() => {
    if (!selectedNode) return null;
    return nodes.find(node => node.id === selectedNode) || null;
  }, [selectedNode]);
  
  // Initial simulation setup
  const initializeSimulation = useCallback(() => {
    if (!svgRef.current) return;
    
    const width = 1200;
    const height = 800;
    
    // Store the current transform to maintain view position after rebuild
    let currentTransform = d3.zoomIdentity;
    if (svgRef.current) {
      const existingTransform = d3.zoomTransform(svgRef.current);
      if (existingTransform) {
        currentTransform = existingTransform;
      }
    }
    
    // Clear existing elements
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create main group for zoom transform
    const g = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");
    
    // Add zoom functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([MIN_ZOOM / 100, MAX_ZOOM / 100])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        // Use requestAnimationFrame to avoid setting state too frequently
        requestAnimationFrame(() => {
          setZoomLevel(Math.round(event.transform.k * 100));
        });
      });
    
    d3.select(svgRef.current).call(zoom);
    
    // Apply the stored transform to maintain view position
    d3.select(svgRef.current).call(zoom.transform, currentTransform);
    
    // Add drop shadow filter for selected nodes
    const defs = g.append("defs");
    
    const filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");
    
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");
    
    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 1)
      .attr("dy", 1)
      .attr("result", "offsetBlur");
    
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
    
    // Create links
    linksRef.current = g.selectAll(".link")
      .data(filteredLinks)
      .enter()
      .append("path")
      .attr("class", d => `link ${d.type}`)
      .attr("fill", "none")
      .attr("stroke", d => d.type === "reports-to" ? "#666" : "#ddd")
      .attr("stroke-width", d => d.type === "reports-to" ? 2 : 1.5)
      .attr("stroke-dasharray", d => d.type === "department" ? "5,5" : "none")
      .attr("marker-end", d => d.type === "reports-to" ? "url(#arrowhead)" : "none");
    
    // Add arrow markers for reporting lines
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30) 
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#666");
    
    // Create node groups with improved event handling
    nodesRef.current = g.selectAll(".node")
      .data(filteredNodes)
      .enter()
      .append("g")
      .attr("class", d => `node node-${d.type} dept-${d.department}`)
      .attr("data-id", d => d.id)
      .attr("data-level", d => d.level || 0)
      .attr("data-dept", d => d.department)
      .style("cursor", d => d.type !== "department" ? "pointer" : "default")
      .attr("tabindex", d => d.type !== "department" ? 0 : -1) 
      .attr("role", d => d.type !== "department" ? "button" : "none")
      .attr("aria-label", d => d.type !== "department" ? `${d.name}, ${d.title || ''}, ${DEPARTMENT_NAMES[d.department]} Department` : '')
      .on("click", (event, d) => {
        // Prevent event propagation to avoid conflicts
        event.stopPropagation();
        if (d.type !== "department") {
          setSelectedNode(d.id === selectedNode ? null : d.id);
          setShowDetailPanel(d.id !== selectedNode);
        }
      })
      .on("keydown", (event, d) => {
        // Handle keyboard navigation
        if (d.type !== "department" && event.key === "Enter") {
          setSelectedNode(d.id === selectedNode ? null : d.id);
          setShowDetailPanel(d.id !== selectedNode);
        }
      });
    
    // Create separate tooltip handling on container level to avoid mouseover issues
    d3.select(containerRef.current)
      .on("mousemove", (event) => {
        if (!tooltipRef.current) return;
        
        // Find the node under the mouse
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        
        // Get actual SVG coordinates
        const svgPoint = svgRef.current?.createSVGPoint();
        if (!svgPoint) return;
        
        svgPoint.x = mouseX - containerRect.left;
        svgPoint.y = mouseY - containerRect.top;
        
        // Convert to graph coordinates if there's a transform
        const transform = d3.zoomTransform(svgRef.current);
        const transformedPoint = svgPoint.matrixTransform(
          (g.node() as SVGGElement).getCTM()?.inverse()
        );
        
        // Find the closest node
        let closestNode = null;
        let closestDistance = Infinity;
        
        simulationRef.current?.nodes().forEach(node => {
          if (node.type === "department") return;
          
          const dx = node.x - transformedPoint.x;
          const dy = node.y - transformedPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Check if within the node's radius
          const nodeRadius = node.type === "executive" ? 60 : (node.type === "manager" ? 55 : 50);
          
          if (distance < nodeRadius && distance < closestDistance) {
            closestNode = node;
            closestDistance = distance;
          }
        });
        
        // Show tooltip if hovering over a node
        if (closestNode && closestNode.type !== "department") {
          const tooltip = tooltipRef.current;
          tooltip.innerHTML = `<strong>${closestNode.name}</strong>${closestNode.title ? `<br/>${closestNode.title}` : ''}`;
          tooltip.style.opacity = "1";
          tooltip.style.left = `${mouseX + 10}px`;
          tooltip.style.top = `${mouseY + 10}px`;
          
          // Highlight department
          setHighlightedDept(closestNode.department);
        } else {
          tooltipRef.current.style.opacity = "0";
          setHighlightedDept(null);
        }
      })
      .on("mouseleave", () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = "0";
          setHighlightedDept(null);
        }
      });
      
    // Set up drag behavior separately to avoid conflicts with other mouse events
    const dragBehavior = d3.drag<SVGGElement, Node>()
      .filter(event => {
        // Only start drag on primary mouse button (left click)
        return !event.ctrlKey && !event.button;
      })
      .on("start", (event, d) => {
        // Prevent event from bubbling up
        event.sourceEvent.stopPropagation();
        
        if (!event.active && simulationRef.current) 
          simulationRef.current.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        // Prevent event from bubbling up
        event.sourceEvent.stopPropagation();
        
        // Limit vertical movement to maintain hierarchy
        const level = d.level || 0;
        const levelHeight = level * SIMULATION_PARAMS.verticalSpacing;
        const allowedRange = SIMULATION_PARAMS.verticalSpacing * 0.3;
        
        d.fx = event.x;
        // Only allow vertical movement within a small range of the assigned level
        d.fy = Math.max(levelHeight - allowedRange, Math.min(levelHeight + allowedRange, event.y));
      })
      .on("end", (event, d) => {
        // Prevent event from bubbling up
        event.sourceEvent.stopPropagation();
        
        if (!event.active && simulationRef.current) 
          simulationRef.current.alphaTarget(0);
        
        // Keep node fixed at its level but allow horizontal movement
        const level = d.level || 0;
        const levelHeight = level * SIMULATION_PARAMS.verticalSpacing;
        d.fx = null;
        d.fy = levelHeight;
      });
      
    // Apply drag behavior only to non-department nodes
    nodesRef.current
      .filter(d => d.type !== "department")
      .call(dragBehavior);
    
    // Add department grouping nodes (invisible)
    nodesRef.current
      .filter(d => d.type === "department")
      .append("rect")
      .attr("width", 160)
      .attr("height", 40)
      .attr("rx", 20)
      .attr("ry", 20)
      .attr("x", -80)
      .attr("y", -20)
      .attr("fill", d => `${DEPARTMENT_COLORS[d.department]}20`)
      .attr("stroke", d => DEPARTMENT_COLORS[d.department])
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3,3")
      .style("opacity", 0.7);
    
    // Add text to department grouping nodes
    nodesRef.current
      .filter(d => d.type === "department")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("fill", d => DEPARTMENT_COLORS[d.department])
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text(d => d.name);
    
    // Add executive nodes (CEO, C-level)
    const executiveNodes = nodesRef.current.filter(d => d.type === "executive");
    
    // Executive node backgrounds
    executiveNodes
      .append("rect")
      .attr("width", 120)
      .attr("height", 100)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("x", -60)
      .attr("y", -50)
      .attr("fill", "white")
      .attr("stroke", d => DEPARTMENT_COLORS[d.department])
      .attr("stroke-width", 3);
    
    // Manager nodes
    const managerNodes = nodesRef.current.filter(d => d.type === "manager");
    
    // Manager node backgrounds
    managerNodes
      .append("rect")
      .attr("width", 110)
      .attr("height", 90)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("x", -55)
      .attr("y", -45)
      .attr("fill", "white")
      .attr("stroke", d => DEPARTMENT_COLORS[d.department])
      .attr("stroke-width", 2);
    
    // Employee nodes
    const employeeNodes = nodesRef.current.filter(d => d.type === "employee");
    
    // Employee node backgrounds
    employeeNodes
      .append("rect")
      .attr("width", 100)
      .attr("height", 80)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("x", -50)
      .attr("y", -40)
      .attr("fill", "white")
      .attr("stroke", d => DEPARTMENT_COLORS[d.department])
      .attr("stroke-width", 1.5);
    
    // Add avatars and labels to all personnel nodes
    const personnelNodes = nodesRef.current.filter(d => d.type !== "department");
    
    // Personnel avatars (clipped to circle)
    personnelNodes.each(function(d) {
      const node = d3.select(this);
      const id = `clip-${d.id}`;
      
      // Add clip path
      const defs = d3.select(svgRef.current).append("defs");
      defs.append("clipPath")
        .attr("id", id)
        .append("circle")
        .attr("r", d.type === "executive" ? 22 : (d.type === "manager" ? 20 : 18))
        .attr("cx", 0)
        .attr("cy", -15);
      
      // Department indicator
      node.append("circle")
        .attr("r", d.type === "executive" ? 24 : (d.type === "manager" ? 22 : 20))
        .attr("cy", -15)
        .attr("fill", "white")
        .attr("stroke", DEPARTMENT_COLORS[d.department])
        .attr("stroke-width", d.type === "executive" ? 3 : (d.type === "manager" ? 2.5 : 2));
      
      // Add avatar image with clip path
      node.append("image")
        .attr("xlink:href", d.avatar || "")
        .attr("width", d.type === "executive" ? 44 : (d.type === "manager" ? 40 : 36))
        .attr("height", d.type === "executive" ? 44 : (d.type === "manager" ? 40 : 36))
        .attr("x", d.type === "executive" ? -22 : (d.type === "manager" ? -20 : -18))
        .attr("y", d.type === "executive" ? -37 : (d.type === "manager" ? -35 : -33))
        .attr("clip-path", `url(#${id})`)
        .attr("aria-hidden", "true")
        .style("opacity", 0.85);
    });
    
    // Name labels
    personnelNodes
      .append("text")
      .attr("dy", 15)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", d => d.type === "executive" ? "13px" : (d.type === "manager" ? "12px" : "11px"))
      .text(d => d.name);
    
    // Title labels
    personnelNodes
      .filter(d => d.title)
      .append("text")
      .attr("dy", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", d => d.type === "executive" ? "11px" : (d.type === "manager" ? "10px" : "9px"))
      .attr("fill", "#666")
      .text(d => {
        // Truncate if too long
        const title = d.title as string;
        return title.length > 25 ? title.substring(0, 22) + '...' : title;
      });
    
    // Copy position data from existing nodes to maintain positions during updates
    const positionMap = new Map();
    if (simulationRef.current) {
      simulationRef.current.nodes().forEach(node => {
        positionMap.set(node.id, { x: node.x, y: node.y, fx: node.fx, fy: node.fy });
      });
    }
    
    // Apply saved positions to new nodes
    filteredNodes.forEach(node => {
      const savedPosition = positionMap.get(node.id);
      if (savedPosition) {
        node.x = savedPosition.x;
        node.y = savedPosition.y;
        node.fx = savedPosition.fx;
        node.fy = savedPosition.fy;
      }
    });
    
    // Create force simulation with hierarchical layout - with smoother parameters
    simulationRef.current = d3.forceSimulation(filteredNodes)
      // Link force
      .force("link", d3.forceLink<Node, Link>(filteredLinks)
        .id(d => d.id)
        .distance(d => d.type === 'reports-to' ? SIMULATION_PARAMS.linkDistance['reports-to'] : SIMULATION_PARAMS.linkDistance['department'])
        .strength(d => d.type === 'reports-to' ? 0.9 : 0.6))
      
      // Vertical positioning force - maintain hierarchy levels
      .force("y", d3.forceY<Node>(d => (d.level || 0) * SIMULATION_PARAMS.verticalSpacing).strength(SIMULATION_PARAMS.verticalStrength))
      
      .force("x", d3.forceX<Node>(d => {
        const deptIndex = Object.keys(DEPARTMENT_COLORS).indexOf(d.department);
        const deptCount = Object.keys(DEPARTMENT_COLORS).length;
        const position = ((deptIndex + 0.5) / deptCount) * width * SIMULATION_PARAMS.departmentSeparation;
        return position;
      }).strength(SIMULATION_PARAMS.horizontalStrength))
      
      // Prevent node overlap
      .force("collide", d3.forceCollide<Node>(d => {
        return d.type === "executive" ? 65 : (d.type === "manager" ? 60 : (d.type === "employee" ? 55 : 50));
      }).strength(0.7).iterations(5))
      
      // Center the graph
      .force("center", d3.forceCenter(width / 2, height / 3))
      
      // Use requestAnimationFrame to avoid forced reflows
      .on("tick", () => {
        if (linksRef.current && nodesRef.current) {
          // Use requestAnimationFrame to optimize rendering performance
          requestAnimationFrame(() => {
            // Update links as curved paths
            linksRef.current
              .attr("d", (d: any) => {
                const source = d.source;
                const target = d.target;
                
                // Different curve styles for different link types
                if (d.type === "department") {
                  return `M${source.x},${source.y}Q${source.x},${(source.y + target.y) / 2} ${target.x},${target.y}`;
                } else {
                  const sourceY = source.y + (source.type === "department" ? 0 : 40);
                  const midY = (sourceY + target.y) / 2;
                  return `M${source.x},${sourceY}C${source.x},${midY} ${target.x},${midY} ${target.x},${target.y - 40}`;
                }
              });
              
            nodesRef.current
              .attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
          });
        }
      });
      
    // Apply simulation parameter tuning for stability
    simulationRef.current
      .alpha(SIMULATION_PARAMS.alpha)
      .alphaDecay(SIMULATION_PARAMS.alphaDecay)
      .velocityDecay(SIMULATION_PARAMS.velocityDecay);
      
    // Freeze nodes initially to prevent wild movement
    if (filteredNodes.length > 0) {
      filteredNodes.forEach(node => {
        // Fix all nodes in place initially
        if (node.level) {
          node.fy = node.level * SIMULATION_PARAMS.verticalSpacing;
        }
      });
      
      // Release horizontal constraints after short delay for gentle positioning
      setTimeout(() => {
        if (simulationRef.current) {
          filteredNodes.forEach(node => {
            // Only keep vertical constraints
            if (node.type !== 'department') {
              node.fx = null;
            }
          });
          simulationRef.current.alpha(SIMULATION_PARAMS.alpha * 0.5).restart();
        }
      }, 300);
    }
    
    // Update selected and highlighted nodes
    updateSelectedNode();
    
    // If there's a search query, highlight matching nodes
    if (searchQuery) {
      highlightSearchResults();
    }
    
  }, [filteredNodes, filteredLinks, selectedNode, highlightedDept, searchQuery]);
  
  // Update the selected node highlighting - optimized to reduce flickering
  const updateSelectedNode = useCallback(() => {
    if (!nodesRef.current) return;
    nodesRef.current.each(function(d) {
      const nodeElement = d3.select(this);
      const isSelected = d.id === selectedNode;
      const isHighlighted = d.department === highlightedDept;
      const isSearchHighlight = nodeElement.select("rect").classed("search-highlight");
      
      // Get the node background element
      const background = nodeElement.select("rect");
      
      // Only update if necessary, and don't interfere with search highlighting
      if (background.size() > 0 && !isSearchHighlight) {
        background
          .attr("stroke", isSelected ? "#f00" : DEPARTMENT_COLORS[d.department])
          .attr("stroke-width", isSelected ? 4 : (d.type === "executive" ? 3 : (d.type === "manager" ? 2 : 1.5)))
          .attr("filter", isSelected ? "url(#drop-shadow)" : "none");
      }
      
      // Set opacity directly rather than using transitions
      const targetOpacity = (highlightedDept && d.department !== highlightedDept && d.type !== "department") ? 0.4 : 1;
      
      // Only update if there's an actual change to make
      const currentOpacity = parseFloat(nodeElement.style("opacity") || "1");
      if (Math.abs(currentOpacity - targetOpacity) > 0.01) {
        nodeElement.style("opacity", targetOpacity);
      }
    });
    
    // Update link opacity directly without transitions
    if (linksRef.current) {
      linksRef.current.each(function(d: any) {
        const linkElement = d3.select(this);
        const sourceDept = (d.source as Node).department;
        const targetDept = (d.target as Node).department;
        
        const targetOpacity = (highlightedDept && sourceDept !== highlightedDept && targetDept !== highlightedDept) ? 0.2 : 1;
        
        // Only update if there's an actual change to make
        const currentOpacity = parseFloat(linkElement.style("opacity") || "1");
        if (Math.abs(currentOpacity - targetOpacity) > 0.01) {
          linkElement.style("opacity", targetOpacity);
        }
      });
    }
  }, [selectedNode, highlightedDept]);
  
  // Highlight nodes matching the search query - optimized to prevent flickering
  const highlightSearchResults = useCallback(() => {
    if (!nodesRef.current || !searchQuery) return;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    
    // Store current animations to clean up
    const currentAnimations = new Map();
    
    nodesRef.current.each(function(d) {
      if (d.type === "department") return;
      
      const nodeElement = d3.select(this);
      const rectElement = nodeElement.select("rect");
      
      // Stop any ongoing transitions to prevent conflicts
      rectElement.interrupt();
      
      const matches = 
        d.name.toLowerCase().includes(lowercaseQuery) || 
        (d.title && d.title.toLowerCase().includes(lowercaseQuery));
      
      if (matches) {
        // Use CSS for pulsing effect instead of chained transitions
        rectElement
          .attr("stroke", "#f00")
          .attr("stroke-width", 3)
          .classed("search-highlight", true)
          .style("animation", "pulse 1.2s infinite ease-in-out");
      } else {
        // Reset the node to its normal appearance
        rectElement
          .attr("stroke", DEPARTMENT_COLORS[d.department])
          .attr("stroke-width", d.type === "executive" ? 3 : (d.type === "manager" ? 2 : 1.5))
          .classed("search-highlight", false)
          .style("animation", null);
      }
    });
  }, [searchQuery]);
  
  // Add CSS for pulsing effect
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes pulse {
        0% { stroke-width: 2px; }
        50% { stroke-width: 4px; }
        100% { stroke-width: 2px; }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Handle department filter toggle
  const toggleDepartmentFilter = useCallback((dept: DepartmentType) => {
    setFilteredDepts(prev => {
      if (prev.includes(dept)) {
        return prev.filter(d => d !== dept);
      } else {
        return [...prev, dept];
      }
    });
  }, []);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilteredDepts([]);
    setSearchQuery('');
    if (searchRef.current) {
      searchRef.current.value = '';
    }
  }, []);
  
  // Export chart as SVG
  const exportChart = useCallback(() => {
    if (!svgRef.current) return;
    
    // Create a copy of the SVG
    const svgContent = svgRef.current.outerHTML;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'organizational_chart.svg';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);
  
  // Handle zoom via buttons and scroll wheel - optimized for smoother transitions
  const handleZoomIn = useCallback(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const currentTransform = d3.zoomTransform(svg.node() as Element);
      const newScale = Math.min((zoomLevel + ZOOM_INCREMENT) / 100, MAX_ZOOM / 100);
      
      // Use transition for smoother zoom experience
      svg.transition()
        .duration(250)
        .call(
          d3.zoom<SVGSVGElement, unknown>().transform as any,
          d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale)
        );
      
      // Update zoom level after transition
      setZoomLevel(Math.min(zoomLevel + ZOOM_INCREMENT, MAX_ZOOM));
    }
  }, [zoomLevel]);
  
  const handleZoomOut = useCallback(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const currentTransform = d3.zoomTransform(svg.node() as Element);
      const newScale = Math.max((zoomLevel - ZOOM_INCREMENT) / 100, MIN_ZOOM / 100);
      
      // Use transition for smoother zoom experience
      svg.transition()
        .duration(250)
        .call(
          d3.zoom<SVGSVGElement, unknown>().transform as any,
          d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale)
        );
      
      // Update zoom level after transition
      setZoomLevel(Math.max(zoomLevel - ZOOM_INCREMENT, MIN_ZOOM));
    }
  }, [zoomLevel]);
  
  // Reset view to initial state
  const resetView = useCallback(() => {
    setZoomLevel(100);
    setSelectedNode(null);
    setHighlightedDept(null);
    setShowDetailPanel(false);
    
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
      );
    }
    
    if (simulationRef.current) {
      // Reset node positions but keep vertical levels
      nodes.forEach(node => {
        node.fx = null;
        if (node.level) {
          node.fy = node.level * SIMULATION_PARAMS.verticalSpacing;
        } else {
          node.fy = null;
        }
      });
      
      simulationRef.current.alpha(1).restart();
    }
  }, []);
  
  // Initial setup and resize handling with improved event handling
  useEffect(() => {
    initializeSimulation();
    
    // Keep simulation running to prevent freeze on mouse interaction
    let animationFrameId: number;
    
    const tick = () => {
      if (simulationRef.current) {
        const currentAlpha = simulationRef.current.alpha();
        if (currentAlpha < 0.01) {
          simulationRef.current.alpha(0.01);
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    
    // Start animation loop
    animationFrameId = requestAnimationFrame(tick);
    
    // Setup resize observer with debouncing
    let resizeTimer: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (simulationRef.current) {
          initializeSimulation();
        }
      }, 250); 
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      // Clean up all resources
      resizeObserver.disconnect();
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animationFrameId);
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [initializeSimulation]);
  
  // Apply search highlighting effect
  useEffect(() => {
    if (searchQuery) {
      highlightSearchResults();
    }
  }, [searchQuery, highlightSearchResults]);
  
  // Update selected node when it changes
  useEffect(() => {
    updateSelectedNode();
  }, [selectedNode, highlightedDept, updateSelectedNode]);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.stop();
      const timer = setTimeout(() => {
        initializeSimulation();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [filteredDepts, debouncedSearchQuery, initializeSimulation]);
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Company Org Chart </h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Controls panel */}
          <ChartControls
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={resetView}
            onExport={exportChart}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />
          
          {/* Search box */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              ref={searchRef}
              type="search"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name or title..."
              aria-label="Search employees"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute end-2.5 bottom-1.5 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSearchQuery('');
                  if (searchRef.current) searchRef.current.value = '';
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Department filter panel */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Filter by Department</h3>
              <button 
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(DEPARTMENT_NAMES).map(([key, name]) => (
                <DepartmentFilterButton
                  key={key}
                  department={key as DepartmentType}
                  name={name}
                  color={DEPARTMENT_COLORS[key as DepartmentType]}
                  isActive={filteredDepts.includes(key as DepartmentType)}
                  onClick={() => toggleDepartmentFilter(key as DepartmentType)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main chart view */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden bg-gray-50"
          role="application"
          aria-label="Company Org Chart"
        >
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox="0 0 1200 800"
          />
          
          <div
            ref={tooltipRef}
            className="absolute bg-gray-800 text-white px-3 py-1.5 rounded text-sm pointer-events-none opacity-0 transition-opacity z-20"
            style={{ top: 0, left: 0 }}
          />
        </div>
        
        {/* Detail panel */}
        {showDetailPanel && selectedNodeDetails && selectedNodeDetails.type !== 'department' && (
          <DetailPanel
            node={selectedNodeDetails}
            onClose={() => setShowDetailPanel(false)}
          />
        )}
      </div>
      
      <div className="p-3 text-xs text-gray-500 border-t text-center">
        Glynac Factory Automation • Click and drag employees to reposition them
      </div>
    </div>
  );
};

// Chart controls component with buttons for zoom, reset, etc.
interface ChartControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onExport: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const ChartControls = memo(({ 
  zoomLevel, 
  onZoomIn, 
  onZoomOut, 
  onReset,
  onExport,
  onToggleFilters,
  showFilters
}: ChartControlsProps) => (
  <div className="flex flex-wrap gap-2">
    <div className="flex gap-2">
      <button
        onClick={onReset}
        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
        aria-label="Reset view"
      >
        <RotateCcw size={14} />
        Reset View
      </button>
      
      <button
        onClick={onExport}
        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
        aria-label="Export chart as SVG"
      >
        <Download size={14} />
        Export
      </button>
      
      <button
        onClick={onToggleFilters}
        className={`px-3 py-1.5 text-xs font-medium bg-white border rounded-lg flex items-center gap-2 transition-colors ${
          showFilters 
            ? 'text-blue-700 border-blue-300 hover:bg-blue-50' 
            : 'text-gray-700 border-gray-200 hover:bg-gray-50'
        }`}
        aria-label="Toggle department filters"
        aria-pressed={showFilters}
      >
        <Filter size={14} />
        Filters
      </button>
    </div>

    <div className="flex items-center bg-white border border-gray-200 rounded-lg divide-x divide-gray-200">
      <ZoomButton 
        onClick={onZoomOut} 
        disabled={zoomLevel <= MIN_ZOOM}
        ariaLabel="Zoom out"
      >
        <Minus size={16} />
      </ZoomButton>
      <span className="px-3 text-sm font-medium text-gray-700 w-20 text-center">
        {Math.round(zoomLevel)}%
      </span>
      <ZoomButton 
        onClick={onZoomIn} 
        disabled={zoomLevel >= MAX_ZOOM}
        ariaLabel="Zoom in"
      >
        <Plus size={16} />
      </ZoomButton>
    </div>
  </div>
));
ChartControls.displayName = "ChartControls";

// ZoomButton component for zoom controls
interface ZoomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel?: string;
}

const ZoomButton = memo(({ 
  children,
  ariaLabel,
  ...props 
}: ZoomButtonProps) => (
  <button
    className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
    aria-label={ariaLabel}
    {...props}
  >
    {children}
  </button>
));
ZoomButton.displayName = "ZoomButton";

// Department filter button component
interface DepartmentFilterButtonProps {
  department: DepartmentType;
  name: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const DepartmentFilterButton = memo(({
  department,
  name,
  color,
  isActive,
  onClick
}: DepartmentFilterButtonProps) => (
  <button
    className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 transition-all ${
      isActive
        ? 'bg-gray-800 text-white shadow-sm'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
    }`}
    onClick={onClick}
    aria-pressed={isActive}
  >
    <span 
      className="w-3 h-3 rounded-full" 
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
    {name}
  </button>
));
DepartmentFilterButton.displayName = "DepartmentFilterButton";

// Detail panel to show additional employee information
interface DetailPanelProps {
  node: Node;
  onClose: () => void;
}

const DetailPanel = memo(({ node, onClose }: DetailPanelProps) => (
  <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <h3 className="font-bold text-gray-800">Employee Details</h3>
      <button 
        onClick={onClose}
        className="p-1 rounded-full hover:bg-gray-100"
        aria-label="Close details panel"
      >
        <X size={18} />
      </button>
    </div>
    
    <div className="p-4">
      <div className="flex flex-col items-center mb-4">
        <div 
          className="w-20 h-20 rounded-full bg-white border-2 overflow-hidden mb-2"
          style={{ borderColor: DEPARTMENT_COLORS[node.department] }}
        >
          <img 
            src={node.avatar} 
            alt={`${node.name}`} 
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="font-bold text-gray-900">{node.name}</h4>
        <p className="text-sm text-gray-600">{node.title}</p>
        <span 
          className="mt-1 px-2 py-0.5 text-xs rounded-full" 
          style={{ 
            backgroundColor: `${DEPARTMENT_COLORS[node.department]}20`,
            color: DEPARTMENT_COLORS[node.department]
          }}
        >
          {DEPARTMENT_NAMES[node.department]}
        </span>
      </div>
      
      <div className="space-y-3">
        {node.email && (
          <DetailItem icon={<Mail size={16} />} label="Email">
            <a href={`mailto:${node.email}`} className="text-sm text-blue-600 hover:underline">
              {node.email}
            </a>
          </DetailItem>
        )}
        
        {node.phone && (
          <DetailItem icon={<Phone size={16} />} label="Phone">
            <span className="text-sm text-gray-700">{node.phone}</span>
          </DetailItem>
        )}
        
        {node.location && (
          <DetailItem icon={<MapPin size={16} />} label="Location">
            <span className="text-sm text-gray-700">{node.location}</span>
          </DetailItem>
        )}
        
        {node.startDate && (
          <DetailItem icon={<Calendar size={16} />} label="Start Date">
            <span className="text-sm text-gray-700">
              {new Date(node.startDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </DetailItem>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h5 className="font-medium text-gray-800 mb-2">Direct Reports</h5>
        <ul className="space-y-2">
          {getDirectReports(node.id).map(report => (
            <li key={report.id} className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full overflow-hidden border"
                style={{ borderColor: DEPARTMENT_COLORS[report.department] }}
              >
                <img 
                  src={report.avatar} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{report.name}</span>
            </li>
          ))}
          {getDirectReports(node.id).length === 0 && (
            <li className="text-sm text-gray-500">No direct reports</li>
          )}
        </ul>
      </div>
    </div>
  </div>
));
DetailPanel.displayName = "DetailPanel";

// DetailItem component for consistent styling of detail items
interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const DetailItem = memo(({ icon, label, children }: DetailItemProps) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-400 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      {children}
    </div>
  </div>
));
DetailItem.displayName = "DetailItem";

// Helper function to get direct reports for a node
function getDirectReports(nodeId: string): Node[] {
  const reportLinks = links.filter(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    return sourceId === nodeId && link.type === 'reports-to';
  });
  
  return reportLinks.map(link => {
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    return nodes.find(node => node.id === targetId)!;
  }).filter(Boolean);
}

// Additional utility components
const Mail = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const Phone = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MapPin = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Calendar = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

// Export the component
export default OrganizationalChart;