import Toast from 'react-native-toast-message';

export const showToast = (type, text1, text2 = '') => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    visibilityTime: 3000,
    autoHide: true,
  });
};

const defaultOptions = {
  visibilityTime: 3000,
  autoHide: true,
};

export const showSuccessToast = (text1, text2 = '') => {
  Toast.show({
    type: 'success',
    text1,
    text2,
    ...defaultOptions,
  });
};

export const showErrorToast = (text1, text2 = '') => {
  Toast.show({
    type: 'error',
    text1,
    text2,
    ...defaultOptions,
  });
};

export const showInfoToast = (text1, text2 = '') => {
  Toast.show({
    type: 'info',
    text1,
    text2,
    ...defaultOptions,
  });
};

// export const formatDate = isoDate => {
//     if (!isoDate) return 'N/A';

//     const date = new Date(isoDate);

//     const options = {day: 'numeric', month: 'long', year: 'numeric'};
//     return date.toLocaleDateString('en-US', options);
//   };

export const formatDate = dateString => {
  if (!dateString) return 'N/A';
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDateTime = isoDate => {
  if (!isoDate) return 'N/A';

  const date = new Date(isoDate);

  // Format options for date + time
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // for AM/PM format
  };

  return date.toLocaleString('en-US', options).replace(',', '');
};

export const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }

    const data = await response.json();
    return data.display_name || 'Unknown location';
  } catch (error) {
    console.error('Error fetching address:', error.message);
    return 'Unable to fetch location';
  }
};



// Add this new function
export const formatDuration = decimalHours => {
  // Handle cases where duration might be null, undefined, or zero
  if (!decimalHours) {
    return '0 min';
  }

  // Get the whole number for hours
  const hours = Math.floor(decimalHours);

  // Get the remaining decimal part and convert it to minutes
  const minutes = Math.round((decimalHours - hours) * 60);

  // Build the formatted string
  let durationString = '';
  if (hours > 0) {
    durationString += `${hours} hr `;
  }
  if (minutes > 0) {
    durationString += `${minutes} min`;
  }

  // If the total duration is less than a minute but not zero, show '1 min'
  if (hours === 0 && minutes === 0 && decimalHours > 0) {
    return 'Less than 1 min';
  }

  return durationString.trim(); // .trim() removes any trailing space
};

