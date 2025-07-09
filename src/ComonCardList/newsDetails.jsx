import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import icon from "../../src/images/Icon_1.png";
import AdSenseAd from "../Components/AdSenseAd.jsx";

const BASE_URL = "https://news-backend-node.onrender.com" || "http://localhost:5000";

const NewsDetails = () => {
  const location = useLocation();
  const { id } = useParams();
  const { story, newsId, categoryId, tagId } = location.state || {};
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [newsData, setNewsData] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingStories, setTrendingStories] = useState([]);
  const [isAdVisible, setIsAdVisible] = useState(false);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        const user = localStorage.getItem("user");
        const userId = JSON.parse(user)?._id;
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/news/CategoryWisenews`, { headers: { Authorization: localStorage.getItem("token"), } }, { userId });
        if (response.data.categoryWiseNews) {
          setStories(response.data.categoryWiseNews);
        } else if (response?.data?.status === 401) {
          setMessage("Your session has expired. Please log in again to continue.");
          navigate("/login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        };
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category-wise news:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  useEffect(() => {
    if (newsData && stories.length > 0) {
      const currentCategory = stories.find(
        (cat) => cat.categoryName === newsData.categoryDetails.category
      );
      if (currentCategory) {
        const filteredNews = currentCategory.news.filter(
          (item) => item._id !== newsData._id
        );
        setTrendingStories(filteredNews.slice(0, 6));
      }
    }
  }, [newsData, stories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          categoryId: story?.categoryId?._id || story?.categoryId || categoryId,
          tagId: story?.tagId?._id || story?.tagId || tagId,
          newsId: story?._id || newsId || id,
        };

        const headers = {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        };

        const response = await axios.post(
          `${BASE_URL}/news/categoryTagNewsWiseNews`,
          payload,
          { headers }
        );

        if (response.data && response.data.categoryTagAndNewsWiseNews) {
          setNewsData(response.data.categoryTagAndNewsWiseNews[0]);
        } else if (response?.data?.status === 401) {
          setMessage("Your session has expired. Please log in again to continue.");
          navigate("/login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [story, categoryId, id, navigate,newsId, tagId, ]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login"); // Redirect to login if user is not logged in
    }
  }, [navigate]);

  const handlenavigatetag = (tagId, categoryId) => {
    navigate(`/tag/${tagId}`, {
      state: {
        categoryId: categoryId,
        tagId: tagId,
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //Newsdetails navigate
  const handlenavigate = (story) => {
    navigate(`/newsdetails/${story._id}`, { state: { story } });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [story]);

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="my-20 px-4">
  {message && (
    <div className="mb-4 text-red-600 text-sm font-medium text-center">{message}</div>
  )}

  <div className="max-w-7xl mx-auto">
    {/* Top Ad */}
    <div className={`flex justify-center items-center ${isAdVisible ? "pb-9" : ""}`}>
      <AdSenseAd width="100%" height="60px" onLoad={(success) => setIsAdVisible(success)} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
      {/* Main Content */}
      <div className="lg:col-span-3">
        {newsData ? (
          <>
            <p
              onClick={() =>
                navigate(
                  `/category/${encodeURIComponent(
                    newsData.categoryDetails.category
                  )}`
                )
              }
              className="text-white uppercase cursor-pointer bg-[#4360ac] rounded-sm mb-3 w-fit px-3 py-1 mx-auto lg:mx-0 text-sm"
            >
              {newsData.categoryDetails.category}
            </p>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-center lg:text-left">
              {newsData.title}
            </h1>

            <p className="text-gray-700 text-end text-sm mb-4">
              {new Date(newsData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <img
              src={`${BASE_URL}/${newsData.heroimage?.replace(/\\/g, "/")}`}
              alt={newsData.title}
              className="w-full max-h-[450px] object-cover rounded-lg mb-6"
            />

            {/* Summary */}
            <div className="rounded-md bg-blue-50 p-4 my-5">
              <h1 className="text-[#4360ac] font-bold text-xl md:text-2xl">Summary</h1>
              <ul className="list-disc px-4 py-2 text-base marker:text-[#4360ac] font-normal space-y-2">
                {newsData.summary.map((item, idx) => (
                  <li key={idx} className="text-gray-600">{truncateText(item.text)}</li>
                ))}
              </ul>
            </div>

            {/* Full Content */}
            <div className="space-y-4 text-gray-800">
              <h2 className="text-xl font-bold">{newsData.heading}</h2>
              {newsData.content_1.map((item, index) => (
                <p key={index}>{truncateText(item.text)}</p>
              ))}

              {newsData.image_2 && (
                <img
                  src={`${BASE_URL}/${newsData.image_2?.replace(/\\/g, "/")}`}
                  alt={newsData.title}
                  className="w-full max-h-[400px] object-cover rounded-lg my-4"
                />
              )}

              {newsData.content_2.map((item, index) => (
                <p key={index}>{truncateText(item.text)}</p>
              ))}

              {newsData.image_3 && (
                <img
                  src={`${BASE_URL}/${newsData.image_3?.replace(/\\/g, "/")}`}
                  alt={newsData.title}
                  className="w-full max-h-[400px] object-cover rounded-lg my-4"
                />
              )}

              {newsData.content_3.map((item, index) => (
                <p key={index}>{truncateText(item.text)}</p>
              ))}
            </div>

            {/* Bottom Ad */}
            <div className={`flex justify-center items-center mt-8 ${isAdVisible ? "pb-9" : ""}`}>
              <AdSenseAd width="100%" height="60px" onLoad={(success) => setIsAdVisible(success)} />
            </div>
          </>
        ) : (
          <div className="w-10 h-10 mx-auto my-20 flex items-center justify-center">
            <img src={icon} alt="Loading..." className="animate-spin" />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 bg-white border border-gray-200 p-4 rounded-xl sticky top-32 max-h-[calc(100vh-150px)] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Trending Stories</h2>
        <AdSenseAd width="100%" height="90px" onLoad={(success) => setIsAdVisible(success)} />

        {loading ? (
          <div className="w-10 h-10 mx-auto my-10 flex items-center justify-center">
            <img src={icon} alt="" className="animate-spin" />
          </div>
        ) : (
          trendingStories.map((item) => (
            <div
              key={item._id}
              onClick={() => handlenavigate(item)}
              className="flex flex-col sm:flex-row items-start gap-3 cursor-pointer border-b py-2"
            >
              <img
                src={`${BASE_URL}/${item.heroimage?.replace(/\\/g, "/")}`}
                alt={item.heading}
                className="w-full sm:w-24 h-20 object-cover rounded-md"
              />
              <p className="text-sm font-semibold text-black">{truncateText(item?.title, 45)}</p>
            </div>
          ))
        )}

        <div className="flex justify-center mt-4">
          <AdSenseAd width="100%" height="90px" onLoad={(success) => setIsAdVisible(success)} />
        </div>
      </div>
    </div>

    {/* Bottom Related News Cards */}
    <hr className="my-10 hidden lg:block" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {loading ? (
        <div className="w-10 h-10 mx-auto my-10 flex items-center justify-center">
          <img src={icon} alt="" className="animate-spin" />
        </div>
      ) : (
        trendingStories.slice(0, 4).map((val) => (
          <div
            key={val._id}
            onClick={() => handlenavigate(val)}
            className="bg-white border rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <img
              src={`${BASE_URL}/${val.heroimage?.replace(/\\/g, "/")}`}
              alt={val.heading}
              className="w-full h-[180px] object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-2">
                {new Date(val.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm font-semibold text-black mb-2">
                {val?.title}
              </p>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handlenavigatetag(
                    val?.tagDetails?._id,
                    newsData.categoryDetails._id
                  );
                }}
                className="text-[10px] cursor-pointer text-blue-600 bg-blue-100 px-2 py-1 rounded hover:bg-blue-600 hover:text-white uppercase transition"
              >
                {val.tagDetails.tag}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</div>

  );
};

export default NewsDetails;
