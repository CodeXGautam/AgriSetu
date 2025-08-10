

export const getWeatherInfo = async(req, res) =>{
    try{
            const location = req.body;
            const apikey = process.env.WEATHER_API_KEY;
            const url = `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${location.lat},${location.lon}&days=7&aqi=no&alerts=yes`;
            const response = await fetch(url);

            const output = await response.json();

            if(output) {
                return res.status(200).json({
                    success:true,
                    message:"weather forecasted successfully",
                    data:output
                })
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"error in fetching weather details",
                })
            }
    }
    catch(error){
        console.error('Error fetching news:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch weather',
            error: error.message
        });
    }
}