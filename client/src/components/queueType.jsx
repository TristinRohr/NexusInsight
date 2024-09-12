import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QueueInfo = ({ queueId }) => {
  const [queueData, setQueueData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueueInfo = async () => {
      try {
        const graphqlQuery = `
          query getQueueType($queueId: Int!) {
            queueType(queueId: $queueId) {
              queueId
              map
              description
              notes
            }
          }
        `;

        const response = await axios.post('/graphql', {
          query: graphqlQuery,
          variables: { queueId }
        });

        setQueueData(response.data.data.queueType);
      } catch (error) {
        console.error('Error fetching queue type:', error);
        setError('Failed to fetch queue type');
      }
    };

    fetchQueueInfo();
  }, [queueId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!queueData) {
    return <div>Loading queue information...</div>;
  }

  return (
    <div>
      <h4>Queue Information</h4>
      <p>Map: {queueData.map}</p>
      <p>Description: {queueData.description}</p>
      <p>Notes: {queueData.notes}</p>
    </div>
  );
};

export default QueueInfo;