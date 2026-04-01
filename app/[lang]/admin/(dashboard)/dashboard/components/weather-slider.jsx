'use client';
import { getCurrentLocationWeather } from '@/utils/weather';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const WeatherSlide = ({ tenant, loggedInUser }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const mountedRef = useRef(true);
    const intervalRef = useRef(null);
    const retryTimeoutRef = useRef(null);

    useEffect(() => {
        mountedRef.current = true;

        const fetchWeatherData = async (forceRefresh = false) => {
            try {
                if (forceRefresh) {
                    setIsRefreshing(true);
                } else {
                    setLoading(true);
                }

                const currentWeather = await getCurrentLocationWeather(forceRefresh);

                // Only update state if component is still mounted
                if (mountedRef.current) {
                    setWeatherData(currentWeather);
                    setError(null);
                }
            } catch (error) {
                if (mountedRef.current) {
                    setError(error.message);

                    // If it's a rate limit error, schedule a retry
                    if (error.message.includes('Rate limit')) {
                        const retryIn = 5 * 60 * 1000; // Retry in 5 minutes

                        retryTimeoutRef.current = setTimeout(() => {
                            if (mountedRef.current) {
                                fetchWeatherData();
                            }
                        }, retryIn);
                    }
                }
            } finally {
                if (mountedRef.current) {
                    setLoading(false);
                    setIsRefreshing(false);
                }
            }
        };

        // Initial fetch
        fetchWeatherData();

        // Set up periodic refresh (every 10 minutes)
        intervalRef.current = setInterval(
            () => {
                if (mountedRef.current) {
                    fetchWeatherData(true); // Force refresh on interval
                }
            },
            10 * 60 * 1000
        ); // 10 minutes

        // Cleanup function
        return () => {
            mountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, []);

    // Manual refresh function (could be triggered by user interaction)
    const handleManualRefresh = async () => {
        if (isRefreshing || loading) return;

        try {
            await fetchWeatherData(true);
        } catch (error) {}
    };

    const getCurrentDate = () => {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return now.toLocaleDateString('en-US', options);
    };

    const getWeatherSlide = () => {
        if (loading) return 'Loading weather...';
        if (isRefreshing) return 'Refreshing weather...';
        if (error) {
            // Show different messages based on error type
            if (error.includes('Rate limit')) {
                return 'Weather rate limited';
            } else if (error.includes('API key')) {
                return 'Weather config error';
            } else {
                return 'Weather unavailable';
            }
        }
        if (!weatherData) return 'No weather data';

        const temp = Math.round(weatherData.weather.main.temp);
        const location =
            weatherData.location.city ||
            weatherData.location.locality ||
            'Unknown location';
        const country =
            weatherData.location.countryCode || weatherData.location.country || '';
        const condition = weatherData.weather.weather[0]?.main || '';

        /*         // Show cache indicator for debugging (remove in production)
        const cacheIndicator = weatherData.cached ? ' (cached)' : ' (fresh)'; */

        return `${temp}°C, ${condition} in ${location}${country ? ', ' + country : ''}`;
    };
    /*   ${process.env.NODE_ENV === 'development' ? cacheIndicator : ''} */

    const slides = [
        `Howdy ${loggedInUser?.name.split(' ')[0] || 'Admin'} !`,
        getCurrentDate(),
        getWeatherSlide(),
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 8000); // Change slide every 8 seconds

        return () => clearInterval(slideInterval);
    }, [slides.length]);

    // Add click handler for manual refresh (optional)
    const handleSlideClick = () => {
        if (currentSlide === 2) {
            // Weather slide
            handleManualRefresh();
        }
    };

    return (
        <div className='relative h-8  overflow-hidden flex items-center'>
            <AnimatePresence mode='wait'>
                <motion.h1
                    key={`${currentSlide}-${
                        weatherData?.weather?.main?.temp || 'loading'
                    }-${isRefreshing ? 'refreshing' : 'idle'}`}
                    className={`absolute text-sm font-medium text-gray-700 dark:text-white text-right tracking-wide whitespace-nowrap ${
                        currentSlide === 2
                            ? 'cursor-pointer hover:text-gray-200 transition-colors'
                            : ''
                    } ${isRefreshing ? 'opacity-75' : ''}`}
                    onClick={handleSlideClick}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.3,
                    }}
                    title={
                        currentSlide === 2
                            ? `Click to refresh weather ${
                                  error ? '(Error: ' + error + ')' : ''
                              }`
                            : undefined
                    }>
                    {slides[currentSlide]}
                    {isRefreshing && currentSlide === 2 && (
                        <motion.span
                            className='inline-block ml-1'
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                            }}>
                            ↻
                        </motion.span>
                    )}
                </motion.h1>
            </AnimatePresence>
        </div>
    );
};

export default WeatherSlide;
