import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../../../../context/AppContext";
import { useReactToPrint } from "react-to-print";
import Logo from "/src/assets/pcs.png";
import { useNavigate } from "react-router-dom";

const MenuView = () => {
  const { axios } = useAppContext();
  const { bookingRef } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Menu_${bookingRef}`,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(
          `/api/menu/${bookingRef}`
        );
        setMenu(res.data.data);
      } catch (error) {
        setError("Failed to load menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (bookingRef) fetchMenu();
  }, [bookingRef]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f7f5ef] to-[#c3ad6b]/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c3ad6b] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading menu...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-[#c3ad6b]/30">
        <div className="bg-red-100 border-l-4 border-[#c3ad6b] text-[#c3ad6b] p-4 max-w-md rounded shadow">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!menu || Object.keys(menu || {}).length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-[#c3ad6b]/30">
        <div className="bg-yellow-100 border-l-4 border-[#c3ad6b] text-[#c3ad6b] p-4 max-w-md rounded shadow">
          <p className="font-bold">Not Found</p>
          <p>No menu found for this booking reference.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-[#c3ad6b]/20 text-[#c3ad6b] rounded hover:bg-[#c3ad6b]/40 font-semibold shadow print:shadow-none print:bg-gray-200 print:text-black"
      >
        ← Back
      </button>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img
            src={Logo}
            alt="logo"
            className="w-[130px] h-[130px] mx-auto mb-4"
          />
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl drop-shadow">
            BUDHHA AVENUE
          </h2>
        </div>
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#c3ad6b] text-white rounded-lg shadow hover:bg-[#b39b5a] transition-colors font-semibold print:hidden"
          >
            🖨️ Print Menu
          </button>
        </div>
        <div
          ref={printRef}
          className="bg-white shadow-lg rounded-2xl overflow-hidden print:pt-0 print:mt-0 print:shadow-none print:p-8 print:m-0"
        >
          <div className="px-4 py-5 sm:px-4 bg-gradient-to-r from-[#f7f5ef] to-[#c3ad6b]/30 print:rounded-none print:flex print:items-center print:justify-between">
            <img
              src={Logo}
              alt="Buddha Avenue Logo"
              className="hidden print:block print:mr-4 print:w-12"
              style={{ maxWidth: "120px" }}
            />
            <h3 className="text-lg leading-6 font-bold text-gray-900 text-center flex-1 print:text-black print:text-center">
              BUDDHA AVENUE
            </h3>
            <div className="hidden print:block print:w-24"></div>
          </div>
          <div className="h-3 print:h-2"></div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0 print:px-2 print:py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 print:grid print:grid-cols-2 print:gap-4 print:p-0">
              {Object.entries(menu || {}).map(([category, items]) => {
                const skip = [
                  "_id",
                  "createdAt",
                  "updatedAt",
                  "__v",
                  "bookingRef",
                ];
                if (skip.includes(category)) return null;
                if (Array.isArray(items) && items.length > 0) {
                  return (
                    <div
                      key={category}
                      className="bg-[#c3ad6b]/10 rounded-lg p-4 shadow-sm border border-[#c3ad6b]/30 print:shadow-none print:border print:bg-white print:p-2"
                    >
                      <h4 className="text-lg font-semibold text-[#c3ad6b] mb-3 pb-2 border-b border-[#c3ad6b]/30 print:text-black print:border-b print:border-gray-300">
                        {category
                          .replaceAll("_", " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </h4>
                      <ul className="space-y-2">
                        {items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start print:text-black"
                          >
                            <span className="flex-shrink-0 h-5 w-5 text-[#c3ad6b] mr-2 print:text-black">
                              •
                            </span>
                            <span className="text-gray-700 print:text-black">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuView;
