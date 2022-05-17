async function fetchGraphQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export const createNewUser = async (token, { email, issuer }) => {
  const operationsDoc = `
    mutation createNewUser($email: String!, $issuer: String!) {
      insert_users(objects: {email: $email, issuer: $issuer}) {
        returning {
          email
          id
          issuer
        }
      }
    }
  `;
  try {
    const response = await fetchGraphQL(
      operationsDoc,
      "createNewUser",
      {
        email,
        issuer,
      },
      token
    );

    if (response.errors) {
      throw new Error("Received error from Hasura: ", response.errors[0].message);
    }

    const data = response.data.insert_users.returning[0];

    console.log({ data });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Checks if user exists in hasura users table
export const isNewUser = async (token, issuer) => {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        email
        id
        issuer
      }
    }
  `;

  try {
    const response = await fetchGraphQL(operationsDoc, "isNewUser", { issuer }, token);

    if (response.errors) {
      throw new Error("Hasura did not return a users array: ", response.errors[0].message);
    }

    return response.data.users.length === 0; // if true, then user is new
  } catch (err) {
    console.log("Failed to fetch GraphQL: " + err.message);
    return null;
  }
};

// Checks if video with given userId already exists in videos table
export const getVideoDataByUserId = async ({ videoId, userId, token }) => {
  const operationsDoc = `
    query isNewVideoRecord ($videoId: String!, $userId: String!) {
      videos(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
        favourited
        id
        userId
        videoId
        watched
      }
    }
  `;

  try {
    const response = await fetchGraphQL(
      operationsDoc,
      "isNewVideoRecord",
      { videoId, userId },
      token
    );
    if (response.errors) {
      throw new Error("Received error from Hasura: ", response.errors[0].message);
    }

    return response.data.videos;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Update User History
export const updateVideoData = async ({ favourited, userId, videoId, token }) => {
  const operationsDoc = `
    mutation updateVideo($favourited: Int!, $userId: String!, $videoId: String!) {
      update_videos(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}, _set: {favourited: $favourited, watched: true}) {
        affected_rows
      }
    }
  `;
  try {
    const response = await fetchGraphQL(
      operationsDoc,
      "updateVideo",
      { favourited, userId, videoId },
      token
    );
    if (response.errors) {
      throw new Error(
        "Hasura error, failed when updating video record",
        response.errors[0].message
      );
    }
    return response.data.update_videos.returning;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Insert User History(watched, reaction) to videos table
export const insertVideoData = async ({ favourited, userId, videoId, token }) => {
  const operationsDoc = `
    mutation insertVideo($favourited: Int, $userId: String!, $videoId: String!) {
      insert_videos(objects: {favourited: $favourited, userId: $userId, videoId: $videoId, watched: true}) {
        affected_rows
      }
    }
  `;
  try {
    const response = await fetchGraphQL(
      operationsDoc,
      "insertVideo",
      { favourited, userId, videoId },
      token
    );

    if (response.errors) {
      throw new Error("Received error from Hasura: ", response.errors[0].message);
    }

    return response.data.insert_videos.returning;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getUserFavouritedVideoIds = async ({ userId, token }) => {
  const operationsDoc = `
    query favouritedVideos($userId: String!) {
      videos(where: {userId: {_eq: $userId}, favourited: {_eq: 1}}) {
        videoId
      }
    }
  `;
  try {
    const response = await fetchGraphQL(operationsDoc, "favouritedVideos", { userId }, token);

    if (response.errors) {
      throw new Error("Received error from Hasura: " + response.errors[0].message);
    }
    return response.data.videos.map((video) => video.videoId);
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getUserWatchedVideoIds = async ({ token }) => {
  const operationsDoc = `
    query watchedVideos {
      videos(where: {watched: {_eq: true}}, order_by: {id: desc}) {
        videoId
      }
    }
  `;
  try {
    const response = await fetchGraphQL(operationsDoc, "watchedVideos", {}, token);

    if (response.errors) {
      throw new Error("Received error from Hasura: ", response.errors[0].message);
    }
    return response.data.videos.map((video) => video.videoId);
  } catch (err) {
    console.log(err);
    return [];
  }
};
