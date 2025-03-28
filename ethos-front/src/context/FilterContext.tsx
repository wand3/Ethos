import { createContext, ReactElement, useState, useEffect, useContext, ReactNode } from "react";
import UseApi from "../hooks/UseApi";
import useFlash from "../hooks/UseFlash";
import Config from "../config";



interface FilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  minPrice: number | undefined;
  setMinPrice: (price: number | undefined) => void;
  maxPrice: number | undefined;
  setMaxPrice: (price: number | undefined) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [keyword, setKeyword] = useState<string>("");

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        keyword,
        setKeyword,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};


export const useFilter = () => {

  const context = useContext(FilterContext);
  // console.log(context)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};






const integrations = [
    {
        title: "Figma",
        desc: "Ut enim ad minim veniam",
        icon: <svg className="w-10 h-10" viewBox="0 0 43 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_690_1894)">
                <path d="M14.1693 48C18.08 48 21.254 44.4159 21.254 39.9999V31.9999H14.1693C10.2586 31.9999 7.08459 35.5839 7.08459 39.9999C7.08459 44.4159 10.2586 48 14.1693 48Z" fill="#0ACF83" />
                <path d="M7.08459 23.9999C7.08459 19.5839 10.2586 15.9999 14.1693 15.9999H21.254V31.9998H14.1693C10.2586 32 7.08459 28.4159 7.08459 23.9999Z" fill="#A259FF" />
                <path d="M7.08459 8.00006C7.08459 3.58406 10.2586 0 14.1693 0H21.254V15.9999H14.1693C10.2586 15.9999 7.08459 12.4161 7.08459 8.00006Z" fill="#F24E1E" />
                <path d="M21.2535 0H28.3382C32.2489 0 35.4229 3.58406 35.4229 8.00006C35.4229 12.4161 32.2489 15.9999 28.3382 15.9999H21.2535V0Z" fill="#FF7262" />
                <path d="M35.4229 23.9999C35.4229 28.4159 32.2489 32 28.3382 32C24.4275 32 21.2535 28.4159 21.2535 23.9999C21.2535 19.5839 24.4275 15.9999 28.3382 15.9999C32.2489 15.9999 35.4229 19.5839 35.4229 23.9999Z" fill="#1ABCFE" />
            </g>
            <defs>
                <clipPath id="clip0_690_1894">
                    <rect width="42.5075" height="48" fill="white" />
                </clipPath>
            </defs>
        </svg>

    }, {
        title: "Github",
        desc: "Ut enim ad minim veniam",
        icon: <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_694_1831)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0005 1C18.303 1.00296 12.7923 3.02092 8.45374 6.69305C4.11521 10.3652 1.23181 15.452 0.319089 21.044C-0.593628 26.636 0.523853 32.3684 3.47174 37.2164C6.41963 42.0643 11.0057 45.7115 16.4099 47.5059C17.6021 47.7272 18.0512 46.9883 18.0512 46.36C18.0512 45.7317 18.0273 43.91 18.0194 41.9184C11.3428 43.3608 9.93197 39.101 9.93197 39.101C8.84305 36.3349 7.26927 35.6078 7.26927 35.6078C5.09143 34.1299 7.43223 34.1576 7.43223 34.1576C9.84455 34.3275 11.1123 36.6194 11.1123 36.6194C13.2504 40.2667 16.7278 39.2116 18.0949 38.5952C18.3095 37.0501 18.9335 35.999 19.621 35.4023C14.2877 34.8017 8.68408 32.7548 8.68408 23.6108C8.65102 21.2394 9.53605 18.9461 11.156 17.2054C10.9096 16.6047 10.087 14.1785 11.3905 10.8829C11.3905 10.8829 13.4054 10.2427 17.9916 13.3289C21.9253 12.2592 26.0757 12.2592 30.0095 13.3289C34.5917 10.2427 36.6026 10.8829 36.6026 10.8829C37.9101 14.1706 37.0875 16.5968 36.8411 17.2054C38.4662 18.9464 39.353 21.2437 39.317 23.6187C39.317 32.7824 33.7015 34.8017 28.3602 35.3905C29.2186 36.1334 29.9856 37.5836 29.9856 39.8122C29.9856 43.0051 29.9578 45.5736 29.9578 46.36C29.9578 46.9962 30.391 47.7391 31.6071 47.5059C37.0119 45.7113 41.5984 42.0634 44.5462 37.2147C47.4941 32.3659 48.611 26.6326 47.6972 21.0401C46.7835 15.4476 43.8986 10.3607 39.5587 6.68921C35.2187 3.01771 29.7067 1.00108 24.0085 1H24.0005Z" fill="#191717" />
                <path d="M9.08887 35.264C9.03721 35.3826 8.84645 35.4181 8.69146 35.3351C8.53646 35.2522 8.42122 35.098 8.47686 34.9755C8.5325 34.853 8.71928 34.8214 8.87428 34.9044C9.02927 34.9874 9.14848 35.1455 9.08887 35.264Z" fill="#191717" />
                <path d="M10.0626 36.3428C9.98028 36.384 9.88612 36.3955 9.79622 36.3753C9.70632 36.3551 9.62629 36.3045 9.56979 36.2321C9.41479 36.0662 9.38298 35.837 9.50221 35.7342C9.62143 35.6315 9.83606 35.6789 9.99105 35.8449C10.146 36.0108 10.1818 36.24 10.0626 36.3428Z" fill="#191717" />
                <path d="M11.0085 37.7139C10.8614 37.8167 10.6111 37.7139 10.472 37.5085C10.4335 37.4716 10.4029 37.4274 10.382 37.3785C10.3611 37.3296 10.3503 37.2771 10.3503 37.2239C10.3503 37.1708 10.3611 37.1183 10.382 37.0694C10.4029 37.0205 10.4335 36.9763 10.472 36.9394C10.619 36.8406 10.8694 36.9394 11.0085 37.141C11.1476 37.3425 11.1516 37.6112 11.0085 37.7139Z" fill="#191717" />
                <path d="M12.2921 39.0417C12.161 39.1879 11.8947 39.1484 11.6761 38.9509C11.4575 38.7533 11.4059 38.4846 11.537 38.3423C11.6682 38.2001 11.9344 38.2396 12.161 38.4332C12.3875 38.6268 12.4312 38.8995 12.2921 39.0417Z" fill="#191717" />
                <path d="M14.0923 39.8162C14.0327 40.0019 13.7625 40.0849 13.4922 40.0058C13.222 39.9268 13.0432 39.7055 13.0948 39.5158C13.1465 39.3262 13.4207 39.2392 13.6949 39.3262C13.9691 39.4131 14.144 39.6225 14.0923 39.8162Z" fill="#191717" />
                <path d="M16.0557 39.9506C16.0557 40.1442 15.8331 40.3102 15.547 40.3141C15.2608 40.3181 15.0264 40.16 15.0264 39.9664C15.0264 39.7728 15.2489 39.6068 15.535 39.6029C15.8212 39.5989 16.0557 39.753 16.0557 39.9506Z" fill="#191717" />
                <path d="M17.8838 39.6463C17.9196 39.84 17.7208 40.0415 17.4347 40.0889C17.1486 40.1363 16.8982 40.0217 16.8624 39.8321C16.8267 39.6424 17.0333 39.4369 17.3115 39.3855C17.5897 39.3342 17.848 39.4527 17.8838 39.6463Z" fill="#191717" />
            </g>
            <defs>
                <clipPath id="clip0_694_1831">
                    <rect width="48" height="48" fill="white" />
                </clipPath>
            </defs>
        </svg>

    }, {
        title: "Discord",
        desc: "Ut enim ad minim veniam",
        icon: <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_694_1840)">
                <path d="M40.634 8.31115C37.5747 6.90738 34.294 5.87315 30.8638 5.28081C30.8013 5.26937 30.7389 5.29794 30.7067 5.35508C30.2848 6.10551 29.8175 7.08451 29.4902 7.854C25.8008 7.30166 22.1304 7.30166 18.5166 7.854C18.1893 7.06741 17.705 6.10551 17.2811 5.35508C17.249 5.29985 17.1866 5.27128 17.1241 5.28081C13.6958 5.87126 10.4151 6.90549 7.35387 8.31115C7.32737 8.32257 7.30465 8.34164 7.28958 8.36638C1.06678 17.6631 -0.6379 26.7313 0.19836 35.6871C0.202144 35.7309 0.22674 35.7728 0.260796 35.7995C4.36642 38.8145 8.34341 40.645 12.2466 41.8582C12.309 41.8773 12.3752 41.8544 12.415 41.803C13.3383 40.5421 14.1613 39.2127 14.867 37.8146C14.9086 37.7327 14.8688 37.6356 14.7837 37.6032C13.4783 37.108 12.2352 36.5042 11.0395 35.8185C10.9449 35.7633 10.9373 35.628 11.0243 35.5632C11.2759 35.3747 11.5276 35.1785 11.7679 34.9804C11.8114 34.9443 11.872 34.9366 11.9231 34.9595C19.7786 38.546 28.2831 38.546 36.0459 34.9595C36.097 34.9347 36.1576 34.9424 36.203 34.9785C36.4433 35.1766 36.6949 35.3747 36.9484 35.5632C37.0354 35.628 37.0298 35.7633 36.9352 35.8185C35.7394 36.5175 34.4964 37.108 33.189 37.6013C33.1039 37.6337 33.0661 37.7327 33.1077 37.8146C33.8285 39.2107 34.6515 40.5402 35.5578 41.8011C35.5957 41.8544 35.6637 41.8773 35.7262 41.8582C39.6483 40.645 43.6252 38.8145 47.7309 35.7995C47.7668 35.7728 47.7895 35.7328 47.7933 35.689C48.7942 25.3351 46.117 16.3413 40.6964 8.36827C40.6832 8.34164 40.6605 8.32257 40.634 8.31115ZM16.04 30.234C13.675 30.234 11.7263 28.0627 11.7263 25.3961C11.7263 22.7295 13.6372 20.5582 16.04 20.5582C18.4617 20.5582 20.3916 22.7486 20.3538 25.3961C20.3538 28.0627 18.4428 30.234 16.04 30.234ZM31.9895 30.234C29.6245 30.234 27.6758 28.0627 27.6758 25.3961C27.6758 22.7295 29.5867 20.5582 31.9895 20.5582C34.4113 20.5582 36.3411 22.7486 36.3033 25.3961C36.3033 28.0627 34.4113 30.234 31.9895 30.234Z" fill="#5865F2" />
            </g>
            <defs>
                <clipPath id="clip0_694_1840">
                    <rect width="48" height="48" fill="white" />
                </clipPath>
            </defs>
        </svg>

    },
]

export default () => (
    <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="max-w-md">
                <h1 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Integrations</h1>
                <p className="text-gray-600 mt-2">Extend and automate your workflow by using integrations for your favorite tools.</p>
            </div>
            <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {
                    integrations.map((item, idx) => (
                        <li className="border rounded-lg">
                            <div className="flex items-start justify-between p-4">
                                <div className="space-y-2">
                                    {item.icon}
                                    <h4 className="text-gray-800 font-semibold">{item.title}</h4>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                </div>
                                <button className="text-gray-700 text-sm border rounded-lg px-3 py-2 duration-150 hover:bg-gray-100">Connect</button>
                            </div>
                            <div className="py-5 px-4 border-t text-right">
                                <a href="javascript:void(0)" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                                    View integration
                                </a>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    </section>
)