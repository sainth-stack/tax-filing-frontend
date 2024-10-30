import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import Heading from "../../components/Heading/Heading";
import { initialTasks } from "./data"; // Ensure this path is correct
import { base_url } from "./../../const"; // Ensure this path is correct
import CustomInput from "../../components/input";

const ServiceForm = () => {
  const [tasks, setTasks] = useState(
    initialTasks.map((task) => ({ ...task, date: "", id: null }))
  );

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${base_url}/service-calendar`);
      const fetchedTasks = response.data.calendars;

      const updatedTasks = initialTasks.map((initialTask) => {
        const foundTask = fetchedTasks.find(
          (task) => task.name === initialTask.name
        );
        return {
          ...initialTask,
          date: foundTask ? foundTask.date.split("T")[0] : "",
          id: foundTask ? foundTask._id : null,
        };
      });

      setTasks(updatedTasks);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDateChange = (index, date) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, date } : task
    );
    setTasks(updatedTasks);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSubmit = tasks
      .filter((task) => task.date)
      .map((task) => ({
        ...task,
        name: task.name,
        date: new Date(task.date).toISOString(),
      }));

    if (dataToSubmit.length === 0) {
      console.log("No tasks with selected dates to submit.");
      return;
    }
    try {
      const responses = await axios.post(
        `${base_url}/service-calendar`,
        dataToSubmit
      );

      const newTasks = responses.data.map((taskResponse, index) => ({
        ...taskResponse,
        name: dataToSubmit[index].name,
        date: dataToSubmit[index].date,
        id: taskResponse._id,
        createdAt: taskResponse.createdAt,
        updatedAt: taskResponse.updatedAt,
      }));

      fetchTasks();
      console.log("Submitted data:", newTasks);
      setTasks(newTasks);
    } catch (error) {
      console.log("Error submitting data:", error);
    }
  };

  const handleUpdate = async (taskId, updatedData) => {
    try {
      const response = await axios.put(
        `${base_url}/service-calendar/${taskId}`,
        updatedData
      );
      fetchTasks();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedData } : task
        )
      );
      console.log("Updated task:", response.data);
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  const handleUpdateAll = async () => {
    const updates = tasks
      .filter((task) => task.id && task.date)
      .map((task) => ({
        ...task,
        id: task.id,
        name: task.name,
        date: new Date(task.date).toISOString(),
      }));

    const creations = tasks
      .filter((task) => !task.id && task.date)
      .map((task) => ({
        name: task.name,
        date: new Date(task.date).toISOString(),
      }));

    try {
      const updatePromises = updates.map((task) =>
        handleUpdate(task.id, {
          ...task,
          name: task.name,
          date: task.date,
        })
      );
      await Promise.all(updatePromises);

      if (creations.length > 0) {
        const creationResponses = await axios.post(
          `${base_url}/service-calendar`,
          creations
        );
        const newTasks = creationResponses.data.map((taskResponse, index) => ({
          name: creations[index].name,
          date: creations[index].date,
          id: taskResponse._id,
          createdAt: taskResponse.createdAt,
          updatedAt: taskResponse.updatedAt,
        }));

        setTasks((prevTasks) => [...prevTasks, ...newTasks]);
      }
    } catch (error) {
      console.log("Error updating or creating tasks:", error);
    }
  };

  return (
    <Card
      sx={{ mx: "auto", mt: 1, boxShadow: 3, borderRadius: 2, maxWidth: 700 }}
    >
      <CardContent>
        <Heading text="Service Form" />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {tasks.map((task, index) => (
            <Box
              key={task.id || index}
              sx={{
                display: "flex",
                gap: 4,
                flexDirection: "row",
                paddingRight: 3,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{ flex: 1, paddingLeft: 2 }}
                className=""
              >
                {task.name}
              </Typography>
              <CustomInput
                key={index}
                id={index}
                type={"date"}
                label={""}
                value={task.date || ""}
                onChange={(e) => handleDateChange(index, e.target.value)}
              />
            </Box>
          ))}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleUpdateAll}
            >
              Update
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceForm;
