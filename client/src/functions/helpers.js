export const getAllDaysData = async (userId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/days/getAllDaysData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId })
    });
    const jsonResponse = await response.json();
    return {daysSuccess:jsonResponse.success, daysMessage:jsonResponse.message};
  } catch (error) {
    return {daysSuccess:false, daysMessage:"Failed to reach server"}
  }
}


export const getVillagesInDay = async (dayId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/villages/getVillagesInDay`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dayId: dayId })
        });
        const jsonResponse = await response.json();
        return { villagesSuccess: jsonResponse.success, villagesMessage: jsonResponse.message }
    } catch (error) {
        return { villagesSuccess: false, villagesMessage: "Failed to reach server" }
    }
}

export const getPersonsInVillage = async (villageId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/persons/getPersonsInVillage`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ villageId: villageId })
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse)
      return {personsSuccess:jsonResponse.success, personsMessage : jsonResponse.message}
    } catch (error) {
      return {personsSuccess:false, personsMessage:"Failed to reach server"}
    }
  }



  
  