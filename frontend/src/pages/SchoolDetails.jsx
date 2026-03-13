import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BASE_URL from "@/lib/utils";
import { TokenContext } from "@/store/TokenContextProvider";
import SchoolFinderDetail from "@/reusableComponents/SchoolFinderDetail";

export default function SchoolDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { primaryColor } = useContext(TokenContext);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid school.");
      setLoading(false);
      return;
    }

    const url = `${BASE_URL}/userSchoolFinder/schools/${id}`;
    setLoading(true);
    setError(null);
    fetch(url)
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          let msg = "School not found.";
          try {
            const d = JSON.parse(text);
            if (d?.message) msg = d.message;
          } catch {
            if (res.status === 404) msg = "School not found.";
          }
          throw new Error(msg);
        }
        return JSON.parse(text);
      })
      .then((data) => setSchool(data))
      .catch((err) => setError(err.message || "Failed to load school"))
      .finally(() => setLoading(false));
  }, [id]);

  const backQuery = searchParams.toString();
  const backToResults = backQuery ? `/schools?${backQuery}` : "/schools";

  const backLink = (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to={backToResults}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          style={{ color: primaryColor }}
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          <span>Back to results</span>
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-8 pt-16">
        {backLink}
        <div className="flex items-center justify-center py-24">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
            style={{ borderColor: primaryColor }}
          />
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-gray-50 pb-8 pt-16">
        {backLink}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-red-700 font-medium">{error || "School not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8 pt-16">
      {backLink}

      <div className="max-w-4xl mx-auto px-4 pt-6">
        <SchoolFinderDetail
          school={school}
          primaryColor={primaryColor}
          radiusMiles={searchParams.get("radiusMiles") || searchParams.get("radiusmiles") || undefined}
        />
      </div>
    </div>
  );
}
