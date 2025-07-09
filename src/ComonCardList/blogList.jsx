import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import image from "../../src/images/Icon_1.png";
import AdSenseAd from "../Components/AdSenseAd.jsx";

const BASE_URL = "https://news-backend-node.onrender.com" || "http://localhost:5000";


const BlogList = () => {
  const location = useLocation();
  const { article } = location.state || {};
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdVisible, setIsAdVisible] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/blog/all`);
        setArticles(response.data.Blogs);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleBlogNavigate = (article) => {
    navigate(`/blogdetails/${article._id}`, { state: { article } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  return (
   <div className="my-20 px-4">
  <div className="max-w-7xl mx-auto w-full">
    {/* Top Ad */}
    <div className={`flex pt-10 justify-center items-center ${isAdVisible ? "pb-9" : ""}`}>
      <AdSenseAd width="100%" height="60px" onLoad={(success) => setIsAdVisible(success)} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
      {/* Main Blog Section */}
      <div className="lg:col-span-3 col-span-1">
        <p className="text-white text-sm uppercase cursor-pointer bg-[#4360ac] rounded-sm mb-3 w-fit px-3 py-1 mx-auto lg:mx-0">
          Blog
        </p>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-center lg:text-left">
          {article?.blog}
        </h1>

        <p className="text-gray-700 text-end text-sm mb-4">
          {new Date(article?.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <img
          src={`${BASE_URL}/${article?.image?.replace(/\\/g, "/")}`}
          alt={article?.blog}
          className="w-full max-h-[450px] object-cover rounded-lg mb-6"
        />

        <div className="space-y-3">
          {article?.blogContent?.map((item, idx) => (
            <p key={idx} className="text-gray-700 text-base leading-relaxed">
              {item.text}
            </p>
          ))}
        </div>

        {/* Bottom Ad */}
        <div className={`flex justify-center items-center mt-8 ${isAdVisible ? "pb-9" : ""}`}>
          <AdSenseAd width="100%" height="60px" onLoad={(success) => setIsAdVisible(success)} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 bg-white border border-gray-200 h-fit p-4 rounded-xl sticky top-32">
        <h1 className="font-extrabold text-xl lg:text-2xl mb-5">Trending Stories</h1>

        {/* Ad */}
        <div className="flex justify-center mb-5">
          <AdSenseAd width="100%" height="60px" onLoad={(success) => setIsAdVisible(success)} />
        </div>

        {articles.slice(0, 6).map((item) => (
          <div
            key={item._id}
            onClick={() => handleBlogNavigate(item)}
            className="flex flex-col sm:flex-row items-start gap-3 cursor-pointer mb-4 border-b pb-2"
          >
            <img
              src={`${BASE_URL}/${item.image?.replace(/\\/g, "/")}`}
              alt={item.blog}
              className="w-full sm:w-24 h-20 object-cover rounded-lg"
            />
            <p className="font-semibold text-sm text-black">{truncateText(item?.blog, 45)}</p>
          </div>
        ))}

        <div className="flex justify-center mt-4">
          <AdSenseAd width="100%" height="60px" onLoad={(success) => setIsAdVisible(success)} />
        </div>
      </div>
    </div>

    {/* Related Stories */}
    <hr className="mt-20 hidden lg:block" />

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
      {loading ? (
        <div className="w-10 h-10 mx-auto my-20 flex items-center justify-center">
          <img src={image} alt="Loading..." className="animate-spin" />
        </div>
      ) : (
        articles.slice(0, 4).map((val) => (
          <div
            key={val._id}
            onClick={() => handleBlogNavigate(val)}
            className="h-[340px] bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="w-full h-[180px] overflow-hidden rounded-t-xl">
              <img
                src={`${BASE_URL}/${val.image?.replace(/\\/g, "/")}`}
                alt={val.blog}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-2">
                {new Date(val.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="line-clamp-2 text-base font-medium text-black">
                {val.blog}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</div>

  );
};

export default BlogList;
