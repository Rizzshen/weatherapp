<?php
header('Content-Type: application/json');
$serverName = "localhost";
$userName = "root";
$password = "";
$conn = mysqli_connect($serverName, $userName, $password);
if (!$conn) {
    die(json_encode(["error" => "database connection Failed:".mysqli_connect_error()]));
}

// Database setup
mysqli_query($conn, "CREATE DATABASE IF NOT EXISTS weather");
mysqli_select_db($conn, 'weather');
mysqli_query($conn, "CREATE TABLE IF NOT EXISTS weather (
    city VARCHAR(30) NOT NULL PRIMARY KEY,
    temp FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    wind_speed FLOAT NOT NULL,
    wind_deg FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    timezone FLOAT NOT NULL,
    dt FLOAT NOT NULL,
    country VARCHAR(30) NOT NULL,
    weather_main VARCHAR(50) NOT NULL,
    weather_description VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL
)");

$cityName = isset($_GET['q']) ? $_GET['q'] : "Lahan";
$selectAllData = "SELECT * FROM weather WHERE city = '$cityName'";
$result = mysqli_query($conn, $selectAllData);

// Common variables
$needUpdate = false;
$isNewData = false;

// Check if we need fresh data
if (mysqli_num_rows($result) == 0) {
    $isNewData = true;
} else {
    $row = mysqli_fetch_assoc($result);
    if ((time() - $row['dt']) > 7200) {
        $needUpdate = true;
    }
}

// Get new data if needed
if ($isNewData || $needUpdate) {
    $url = "https://api.openweathermap.org/data/2.5/weather?q=$cityName&appid=4424ae3b42b8bedc0499d6c18a35137d";
    $response = file_get_contents($url);
    $data = json_decode($response, true);

    // Extract data
    $temp = $data['main']['temp'];
    $humidity = $data['main']['humidity'];
    $wind_speed = $data['wind']['speed'];
    $wind_deg = $data['wind']['deg'];
    $pressure = $data['main']['pressure'];
    $timezone = $data['timezone'];
    $dt = $data['dt'];
    $country = $data['sys']['country'];
    $weather_main = $data['weather'][0]['main'];
    $weather_description = $data['weather'][0]['description'];
    $icon = $data['weather'][0]['icon'];

    // Build query
    if ($isNewData) {
        $query = "INSERT INTO weather (
            city, temp, humidity, wind_speed, wind_deg, pressure, 
            timezone, dt, country, weather_main, weather_description, 
            icon
        ) VALUES (
            '$cityName',
            $temp,
            $humidity,
            $wind_speed,
            $wind_deg,
            $pressure,
            $timezone,
            $dt,
            '$country',
            '$weather_main',
            '$weather_description',
            '$icon'
        )";
    } else {
        $query = "UPDATE weather SET
            temp = $temp,
            humidity = $humidity,
            wind_speed = $wind_speed,
            wind_deg = $wind_deg,
            pressure = $pressure,
            timezone = $timezone,
            dt = $dt,
            country = '$country',
            weather_main = '$weather_main',
            weather_description = '$weather_description',
            icon = '$icon'
            WHERE city = '$cityName'";
    }
    
    mysqli_query($conn, $query);
}

// Final output
$result = mysqli_query($conn, $selectAllData);
$rows = [];
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}
echo json_encode($rows);
mysqli_close($conn);
?>