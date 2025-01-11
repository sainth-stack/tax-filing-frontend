import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Button, Typography } from "@mui/material";
import axios from "axios";
import Heading from "../../components/Heading/Heading";
import { initialTasks } from "./data"; // Ensure this path is correct
import { base_url } from "./../../const"; // Ensure this path is correct
import CustomInput from "../../components/input";
import Loader from "../../components/helpers/loader";
import ReactDatePicker from 'react-datepicker'; // Assuming you're using react-datepicker
import "react-datepicker/dist/react-datepicker.css";

const ServiceForm = () => {
  const [loading, setLoading] = useState({});
  const [visibleDatePicker, setVisibleDatePicker] = useState(null);

  const [tasks, setTasks] = useState(
    initialTasks.map((task) => ({
      ...task,
      date: "",
      id: null,
      modified: false,
    }))
  );

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${base_url}/service-calendar`);
      const fetchedTasks = response.data.calendars; // Assign response data to fetchedTasks
      const updatedTasks = initialTasks.map((initialTask) => {
        const foundTask = fetchedTasks.find(
          (task) => task.name === initialTask.name
        );
        return {
          ...initialTask,
          ...foundTask,
          date: foundTask ? foundTask.date.split("T")[0] : "",
          id: foundTask ? foundTask._id : null,
          modified: false, // Ensure modified flag is set to false initially
        };
      });

      setTasks(updatedTasks); // Update the tasks state with fetched data
    } catch (error) {
      // console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDateChange = (index, date) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, date, modified: true } : task
    );
    setTasks(updatedTasks);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSubmit = tasks?.filter((task) => task?.date)?.map((task) => ({
      ...task,
      name: task?.name,
      date: new Date(task?.date).toISOString(),
    }));

    if (dataToSubmit.length === 0) {
      return;
    }
    const newLoadingState = dataToSubmit.reduce((acc, task, index) => {
      const key = task.id || `new-${index}`;
      return { ...acc, [key]: true };
    }, {});
    setLoading(newLoadingState);

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

      setTasks(newTasks);
      setLoading((prevLoading) => {
        const clearedLoadingState = dataToSubmit.reduce((acc, task, index) => {
          const key = task.id || `new-${index}`;
          return { ...acc, [key]: false };
        }, {});
        return { ...prevLoading, ...clearedLoadingState };
      });
    } catch (error) {
      setLoading((prevLoading) => {
        const clearedLoadingState = dataToSubmit.reduce((acc, task, index) => {
          const key = task.id || `new-${index}`;
          return { ...acc, [key]: false };
        }, {});
        return { ...prevLoading, ...clearedLoadingState };
      });
      // console.log("Error submitting data:", error);
    }
  };

  const handleUpdate = async (taskId, updatedData) => {
    setLoading((prevLoading) => ({ ...prevLoading, [taskId]: true }));
    try {
      const response = await axios.put(
        `${base_url}/service-calendar/${taskId}`,
        updatedData
      );

      setLoading((prevLoading) => ({ ...prevLoading, [taskId]: false }));
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, ...updatedData, modified: false }
            : task
        )
      );

    } catch (error) {
      setLoading((prevLoading) => ({ ...prevLoading, [taskId]: false }));
      // console.log("Error updating task:", error);
    }
  };

  const handleUpdateAll = async () => {
    const tasksToUpdate = tasks.filter((task) => task.id && task.modified);
    const tasksToCreate = tasks.filter((task) => !task.id && task.date);
    try {
      // Only update modified tasks
      const updatePromises = tasksToUpdate.map((task) =>
        handleUpdate(task.id, { ...task, date: new Date(task.date).toISOString() })
      );

      await Promise.all(updatePromises);

      // Handle creations as before
      if (tasksToCreate.length > 0) {
        const creationResponses = await axios.post(
          `${base_url}/service-calendar`,
          tasksToCreate.map((task) => ({
            ...task,
            name: task.name,
            date: new Date(task.date).toISOString(),
          }))
        );

        setLoading((prevLoading) => ({ ...prevLoading }));

        const newTasks = creationResponses.data.map((taskResponse, index) => ({
          ...taskResponse,
          name: tasksToCreate[index].name,
          date: tasksToCreate[index].date,
          id: taskResponse._id,
          modified: false, // Ensure new tasks are not marked as modified
        }));

        setTasks((prevTasks) => [...prevTasks, ...newTasks]);
      }
      fetchTasks();
    } catch (error) {
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
          {tasks.map((task, index) => {
            const historyDates = task?.prevDates?.length > 0
              ? task?.prevDates[0]?.history
              : [];
            return (
              (
                <Box
                  key={task.id || index}
                  sx={{
                    display: "flex",
                    gap: 4,
                    flexDirection: "row",
                    paddingRight: 3,
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ flex: 1, paddingLeft: 2, cursor: 'pointer' }}
                    className=""
                  >
                    <span onClick={() => setVisibleDatePicker(visibleDatePicker === index ? null : index)}
                    >
                      {task.name}
                    </span>
                    {visibleDatePicker === index && (
                      <div style={{ position: 'absolute', zIndex: 10 }}>
                        <ReactDatePicker
                          selected={task.date ? new Date(task.date) : null}
                          // onChange={(date) => handleDateChange(index, date)}
                          multiple
                          inline // Keep inline to show calendar, not just text input
                          // minDate={new Date()}
                          showYearDropdown
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select a date"
                          dayClassName={(date) =>
                            historyDates.some((d) => new Date(d).toDateString() === date.toDateString())
                              ? 'selected'
                              : ''
                          }
                          highlightDates={historyDates.map((date) => new Date(date))}
                          calendarClassName="custom-calendar" // Optional: for custom styles
                        />
                      </div>
                    )}

                  </Typography>

                  {loading[task.id] && (
                    <Typography variant="body2" color="primary">
                      <Loader />
                    </Typography>
                  )}
                  <CustomInput
                    key={index}
                    id={index}
                    type={"date"}
                    label={""}
                    value={task.date || ""}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                  />
                </Box>
              )
            )
          })}

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
