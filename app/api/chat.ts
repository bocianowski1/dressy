export async function getMessages(user1: string, user2: string) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_MESSAGES_URL}/messages?user1=${user1}&user2=${user2}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status !== 200) {
      console.error(response.statusText);
      console.error(response.status);
      throw new Error(response.statusText);
    }

    const messages = await response.json();

    return messages;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMessagesForUser(user: string) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_MESSAGES_URL}/messages?user1=${user}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status !== 200) {
      console.error(response.statusText);
      console.error(response.status);
      throw new Error(response.statusText);
    }

    const messages = await response.json();

    return messages;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
