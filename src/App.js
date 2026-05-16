import React, { useState, useEffect } from 'react';
import { Container, Select, MenuItem, InputLabel, FormControl, Card, CardContent, Typography, Badge, Grid } from '@mui/material';
import { Log } from './logger';
import { getTopNotifications } from './stage1_priority';

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [limit, setLimit] = useState(10);
  const [viewedIds, setViewedIds] = useState(new Set());

  // === STAGE 1 & 2: INITIAL REST API FETCH ENGINE ===
  useEffect(() => {
    async function pullData() {
      try {
        let endpoint = `http://4.224.186.213/evaluation-service/notifications?limit=${limit}`;
        if (typeFilter) endpoint += `&notification_type=${typeFilter}`;

        const res = await fetch(endpoint, {
          headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzZWVsYW0uZGVlcGlrYTIwMjJAdml0c3R1ZGVudC5hYy5pbiIsImV4cCI6MTc3ODkzMjU5NSwiaWF0IjoxNzc4OTMxNjk1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNDZkMjcyOWQtNDg1ZC00ZDc0LTkxZjItNmI2ODZjMTcwNzU4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2VlbGFtIGRlZXBpa2EiLCJzdWIiOiI4ODUwYTg4MS1hM2ZlLTQxOTgtOTY0My02OWNmMGI2YmFiMjgifSwiZW1haWwiOiJzZWVsYW0uZGVlcGlrYTIwMjJAdml0c3R1ZGVudC5hYy5pbiIsIm5hbWUiOiJzZWVsYW0gZGVlcGlrYSIsInJvbGxObyI6IjIybWlzMDQxMSIsImFjY2Vzc0NvZGUiOiJTZkZ1V2ciLCJjbGllbnRJRCI6Ijg4NTBhODgxLWEzZmUtNDE5OC05NjQzLTY5Y2YwYjZiYWIyOCIsImNsaWVudFNlY3JldCI6ImZXVkNnVGZYR3NOa3BVdUUifQ.BvSsWlalMxKwWT578TFJpkNfrWcDNoszNhHohWccKLY" }
        });
        
        const parsed = await res.json();
        const dataArray = Array.isArray(parsed) ? parsed : (parsed.notifications || []);
        setNotifications(dataArray);
        
        Log("frontend", "info", "page", "Fetched active items list block.");
      } catch (err) {
        console.error("Fetch failed:", err);
        Log("frontend", "error", "api", `API network disconnect error: ${err.message}`);
      }
    }
    pullData();
  }, [typeFilter, limit]);


  // === STAGE 3: LIVE REAL-TIME WEBSOCKET CONNECTION ENGINE ===
  useEffect(() => {
    const socket = new WebSocket("ws://4.224.186.213/evaluation-service/ws");

    socket.onopen = () => {
      Log("frontend", "info", "websocket", "Real-time streaming connection established successfully.");
    };

    socket.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        
        setNotifications((prevList) => {
          const combined = [newNotification, ...prevList];
          return getTopNotifications(combined, limit);
        });

        Log("frontend", "info", "websocket", `Received live stream item payload: ${newNotification.id || "dynamic"}`);
      } catch (err) {
        console.error("Failed parsing incoming stream payload:", err);
      }
    };

    socket.onerror = (error) => {
      Log("frontend", "error", "websocket", `Streaming pipeline connection fault error: ${error.message}`);
    };

    socket.onclose = () => {
      Log("frontend", "warn", "websocket", "Real-time stream pipeline closed.");
    };

    return () => socket.close();
  }, [limit]);


  // === USER INTERFACE PRESENTATION LAYOUT ===
  return (
    <Container maxWidth="md" style={{ marginTop: '2.5rem' }}>
      <Typography variant="h4" fontWeight="700" color="primary" gutterBottom>
        Campus Priority Interface
      </Typography>
      
      <Grid container spacing={2} style={{ marginBottom: '2rem' }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Category Filter</InputLabel>
            <Select value={typeFilter} label="Category Filter" onChange={(e) => setTypeFilter(e.target.value)}>
              <MenuItem value="">All Notifications</MenuItem>
              <MenuItem value="Placement">Placements</MenuItem>
              <MenuItem value="Result">Results</MenuItem>
              <MenuItem value="Event">Events</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Display Limit (n)</InputLabel>
            <Select value={limit} label="Display Limit (n)" onChange={(e) => setLimit(Number(e.target.value))}>
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {getTopNotifications(notifications, limit).map((item, index) => {
        const itemId = item.id || item.ID || index;
        const itemType = item.type || item.Type || "Notification";
        const itemMessage = item.message || item.Message || "No text available";
        const itemTimestamp = item.timestamp || item.Timestamp || "N/A";
        const checked = viewedIds.has(itemId);

        return (
          <Card 
            key={itemId} 
            onClick={() => { setViewedIds(prev => new Set([...prev, itemId])); Log("frontend", "info", "component", `Clicked item ${itemId}`); }}
            style={{ marginBottom: '1rem', backgroundColor: checked ? '#fcfcfc' : '#ffffff', borderLeft: checked ? '1px solid #ccc' : '5px solid #1976d2', cursor: 'pointer' }}
          >
            <CardContent>
              <Badge color="error" variant="dot" invisible={checked}>
                <Typography variant="h6" style={{ fontWeight: checked ? '400' : '600' }}>
                  [{itemType}] {itemMessage}
                </Typography>
              </Badge>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                Timestamp: {itemTimestamp}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}