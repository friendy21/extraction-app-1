"use client"

import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { ImageIcon, Upload, ArrowLeft, ArrowRight, MapPin, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStep } from '../StepContext';

const OrganizationSetup = () => {
    const router = useRouter();
    const { setCurrentStep } = useStep();
    const [logo, setLogo] = useState(null);
    const [organizationName, setOrganizationName] = useState('');
    const [industry, setIndustry] = useState('');
    const [organizationSize, setOrganizationSize] = useState('');
    const [country, setCountry] = useState('');
    const [stateProvince, setStateProvince] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [agreedToPolicy, setAgreedToPolicy] = useState(false);
    const [formError, setFormError] = useState('');
    
    // Additional fields for expanded details
    const [website, setWebsite] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Countries list directly embedded in the component
    const countries = [
        { code: "AF", name: "Afghanistan" },
        { code: "AL", name: "Albania" },
        { code: "DZ", name: "Algeria" },
        { code: "AD", name: "Andorra" },
        { code: "AO", name: "Angola" },
        { code: "AG", name: "Antigua and Barbuda" },
        { code: "AR", name: "Argentina" },
        { code: "AM", name: "Armenia" },
        { code: "AU", name: "Australia" },
        { code: "AT", name: "Austria" },
        { code: "AZ", name: "Azerbaijan" },
        { code: "BS", name: "Bahamas" },
        { code: "BH", name: "Bahrain" },
        { code: "BD", name: "Bangladesh" },
        { code: "BB", name: "Barbados" },
        { code: "BY", name: "Belarus" },
        { code: "BE", name: "Belgium" },
        { code: "BZ", name: "Belize" },
        { code: "BJ", name: "Benin" },
        { code: "BT", name: "Bhutan" },
        { code: "BO", name: "Bolivia" },
        { code: "BA", name: "Bosnia and Herzegovina" },
        { code: "BW", name: "Botswana" },
        { code: "BR", name: "Brazil" },
        { code: "BN", name: "Brunei" },
        { code: "BG", name: "Bulgaria" },
        { code: "BF", name: "Burkina Faso" },
        { code: "BI", name: "Burundi" },
        { code: "CV", name: "Cabo Verde" },
        { code: "KH", name: "Cambodia" },
        { code: "CM", name: "Cameroon" },
        { code: "CA", name: "Canada" },
        { code: "CF", name: "Central African Republic" },
        { code: "TD", name: "Chad" },
        { code: "CL", name: "Chile" },
        { code: "CN", name: "China" },
        { code: "CO", name: "Colombia" },
        { code: "KM", name: "Comoros" },
        { code: "CG", name: "Congo" },
        { code: "CD", name: "Congo (Democratic Republic)" },
        { code: "CR", name: "Costa Rica" },
        { code: "CI", name: "Côte d'Ivoire" },
        { code: "HR", name: "Croatia" },
        { code: "CU", name: "Cuba" },
        { code: "CY", name: "Cyprus" },
        { code: "CZ", name: "Czech Republic" },
        { code: "DK", name: "Denmark" },
        { code: "DJ", name: "Djibouti" },
        { code: "DM", name: "Dominica" },
        { code: "DO", name: "Dominican Republic" },
        { code: "EC", name: "Ecuador" },
        { code: "EG", name: "Egypt" },
        { code: "SV", name: "El Salvador" },
        { code: "GQ", name: "Equatorial Guinea" },
        { code: "ER", name: "Eritrea" },
        { code: "EE", name: "Estonia" },
        { code: "SZ", name: "Eswatini" },
        { code: "ET", name: "Ethiopia" },
        { code: "FJ", name: "Fiji" },
        { code: "FI", name: "Finland" },
        { code: "FR", name: "France" },
        { code: "GA", name: "Gabon" },
        { code: "GM", name: "Gambia" },
        { code: "GE", name: "Georgia" },
        { code: "DE", name: "Germany" },
        { code: "GH", name: "Ghana" },
        { code: "GR", name: "Greece" },
        { code: "GD", name: "Grenada" },
        { code: "GT", name: "Guatemala" },
        { code: "GN", name: "Guinea" },
        { code: "GW", name: "Guinea-Bissau" },
        { code: "GY", name: "Guyana" },
        { code: "HT", name: "Haiti" },
        { code: "HN", name: "Honduras" },
        { code: "HU", name: "Hungary" },
        { code: "IS", name: "Iceland" },
        { code: "IN", name: "India" },
        { code: "ID", name: "Indonesia" },
        { code: "IR", name: "Iran" },
        { code: "IQ", name: "Iraq" },
        { code: "IE", name: "Ireland" },
        { code: "IL", name: "Israel" },
        { code: "IT", name: "Italy" },
        { code: "JM", name: "Jamaica" },
        { code: "JP", name: "Japan" },
        { code: "JO", name: "Jordan" },
        { code: "KZ", name: "Kazakhstan" },
        { code: "KE", name: "Kenya" },
        { code: "KI", name: "Kiribati" },
        { code: "KP", name: "Korea (North)" },
        { code: "KR", name: "Korea (South)" },
        { code: "KW", name: "Kuwait" },
        { code: "KG", name: "Kyrgyzstan" },
        { code: "LA", name: "Laos" },
        { code: "LV", name: "Latvia" },
        { code: "LB", name: "Lebanon" },
        { code: "LS", name: "Lesotho" },
        { code: "LR", name: "Liberia" },
        { code: "LY", name: "Libya" },
        { code: "LI", name: "Liechtenstein" },
        { code: "LT", name: "Lithuania" },
        { code: "LU", name: "Luxembourg" },
        { code: "MG", name: "Madagascar" },
        { code: "MW", name: "Malawi" },
        { code: "MY", name: "Malaysia" },
        { code: "MV", name: "Maldives" },
        { code: "ML", name: "Mali" },
        { code: "MT", name: "Malta" },
        { code: "MH", name: "Marshall Islands" },
        { code: "MR", name: "Mauritania" },
        { code: "MU", name: "Mauritius" },
        { code: "MX", name: "Mexico" },
        { code: "FM", name: "Micronesia" },
        { code: "MD", name: "Moldova" },
        { code: "MC", name: "Monaco" },
        { code: "MN", name: "Mongolia" },
        { code: "ME", name: "Montenegro" },
        { code: "MA", name: "Morocco" },
        { code: "MZ", name: "Mozambique" },
        { code: "MM", name: "Myanmar" },
        { code: "NA", name: "Namibia" },
        { code: "NR", name: "Nauru" },
        { code: "NP", name: "Nepal" },
        { code: "NL", name: "Netherlands" },
        { code: "NZ", name: "New Zealand" },
        { code: "NI", name: "Nicaragua" },
        { code: "NE", name: "Niger" },
        { code: "NG", name: "Nigeria" },
        { code: "MK", name: "North Macedonia" },
        { code: "NO", name: "Norway" },
        { code: "OM", name: "Oman" },
        { code: "PK", name: "Pakistan" },
        { code: "PW", name: "Palau" },
        { code: "PS", name: "Palestine" },
        { code: "PA", name: "Panama" },
        { code: "PG", name: "Papua New Guinea" },
        { code: "PY", name: "Paraguay" },
        { code: "PE", name: "Peru" },
        { code: "PH", name: "Philippines" },
        { code: "PL", name: "Poland" },
        { code: "PT", name: "Portugal" },
        { code: "QA", name: "Qatar" },
        { code: "RO", name: "Romania" },
        { code: "RU", name: "Russia" },
        { code: "RW", name: "Rwanda" },
        { code: "KN", name: "Saint Kitts and Nevis" },
        { code: "LC", name: "Saint Lucia" },
        { code: "VC", name: "Saint Vincent and the Grenadines" },
        { code: "WS", name: "Samoa" },
        { code: "SM", name: "San Marino" },
        { code: "ST", name: "Sao Tome and Principe" },
        { code: "SA", name: "Saudi Arabia" },
        { code: "SN", name: "Senegal" },
        { code: "RS", name: "Serbia" },
        { code: "SC", name: "Seychelles" },
        { code: "SL", name: "Sierra Leone" },
        { code: "SG", name: "Singapore" },
        { code: "SK", name: "Slovakia" },
        { code: "SI", name: "Slovenia" },
        { code: "SB", name: "Solomon Islands" },
        { code: "SO", name: "Somalia" },
        { code: "ZA", name: "South Africa" },
        { code: "SS", name: "South Sudan" },
        { code: "ES", name: "Spain" },
        { code: "LK", name: "Sri Lanka" },
        { code: "SD", name: "Sudan" },
        { code: "SR", name: "Suriname" },
        { code: "SE", name: "Sweden" },
        { code: "CH", name: "Switzerland" },
        { code: "SY", name: "Syria" },
        { code: "TW", name: "Taiwan" },
        { code: "TJ", name: "Tajikistan" },
        { code: "TZ", name: "Tanzania" },
        { code: "TH", name: "Thailand" },
        { code: "TL", name: "Timor-Leste" },
        { code: "TG", name: "Togo" },
        { code: "TO", name: "Tonga" },
        { code: "TT", name: "Trinidad and Tobago" },
        { code: "TN", name: "Tunisia" },
        { code: "TR", name: "Turkey" },
        { code: "TM", name: "Turkmenistan" },
        { code: "TV", name: "Tuvalu" },
        { code: "UG", name: "Uganda" },
        { code: "UA", name: "Ukraine" },
        { code: "AE", name: "United Arab Emirates" },
        { code: "GB", name: "United Kingdom" },
        { code: "US", name: "United States" },
        { code: "UY", name: "Uruguay" },
        { code: "UZ", name: "Uzbekistan" },
        { code: "VU", name: "Vanuatu" },
        { code: "VA", name: "Vatican City" },
        { code: "VE", name: "Venezuela" },
        { code: "VN", name: "Vietnam" },
        { code: "YE", name: "Yemen" },
        { code: "ZM", name: "Zambia" },
        { code: "ZW", name: "Zimbabwe" }
    ];

    const handleLogoChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setLogo(event.target.files[0]);
        }
    };

    const handleToggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const handleSubmit = () => {
        // Reset error message
        setFormError('');

        // Validate required fields
        if (!organizationName.trim()) {
            setFormError('Please enter your organization name');
            return;
        }

        if (!country) {
            setFormError('Please select your country');
            return;
        }

        if (!stateProvince.trim()) {
            setFormError('Please enter your state/province');
            return;
        }

        if (!agreedToPolicy) {
            setFormError('Please agree to the privacy policy and terms of service');
            return;
        }

        // If validation passes, save data and navigate
        console.log({
            organizationName,
            industry,
            organizationSize,
            country,
            stateProvince,
            logo,
            // Include additional details if shown
            ...(showDetails && {
                website,
                phoneNumber,
                address: {
                    street: streetAddress,
                    city,
                    zipCode
                }
            }),
            agreedToPolicy
        });

        // Navigate to connection page
        router.push('/components/FirstTimeSetUp/ConnectionSetup');
        setCurrentStep(1); // Move to Connection step
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="rounded-xl shadow-xl w-full max-w-3xl bg-white overflow-hidden">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-8">
                    <h1 className="text-2xl font-bold mb-3 text-center text-white">
                        Organization Profile
                    </h1>
                    <p className="text-base text-center text-blue-100">
                        Complete your organization details to personalize your analytics dashboard
                    </p>
                </div>

                {/* Main content */}
                <div className="p-8">
                    {/* Logo Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-base font-semibold text-gray-800">Organization Logo</label>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            {/* Logo Preview Area */}
                            <div className="w-32 h-32 border border-gray-200 rounded-lg flex items-center justify-center bg-white shadow-sm transition-all hover:shadow-md overflow-hidden">
                                {logo ? (
                                    <img 
                                        src={URL.createObjectURL(logo)} 
                                        alt="Organization Logo" 
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <ImageIcon className="w-10 h-10 text-gray-300 mb-1" />
                                        <span className="text-xs text-gray-400 px-2 text-center">Add your brand logo</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Upload Button */}
                            <div className="flex-1">
                                <Button
                                    variant="outline"
                                    className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-md font-medium transition-colors shadow-sm"
                                    onClick={() => document.getElementById('logo-upload').click()}
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Logo</span>
                                </Button>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .gif"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Supported formats: PNG, JPG, GIF (max 5MB)
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            Primary Information
                            <span className="text-xs ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Required</span>
                        </h2>
                    </div>

                    {/* Organization Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium mb-1.5 block text-gray-700">
                                Organization Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                required
                                placeholder="Enter your organization name"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block text-gray-700">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block text-gray-700">
                                State / Province <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={stateProvince}
                                onChange={(e) => setStateProvince(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                required
                                placeholder="Enter state or province"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block text-gray-700">Industry</label>
                            <select
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                            >
                                <option value="">Select Industry</option>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Non-profit">Non-profit</option>
                                <option value="Retail">Retail</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Consulting">Consulting</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block text-gray-700">Organization Size</label>
                            <select
                                value={organizationSize}
                                onChange={(e) => setOrganizationSize(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                            >
                                <option value="">Select Size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="501+">501+ employees</option>
                            </select>
                        </div>
                    </div>

                    {/* Toggle Additional Details Button */}
                    <div className="flex items-center space-x-2 mb-4">
                        <Button
                            variant="outline"
                            className={`text-sm px-4 py-2 rounded-md transition-colors font-medium flex items-center space-x-2 ${
                                showDetails 
                                ? "bg-blue-50 text-blue-700 border-blue-200" 
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={handleToggleDetails}
                        >
                            <Info className="w-4 h-4" />
                            <span>{showDetails ? 'Hide' : 'Show'} additional details</span>
                        </Button>
                        
                        <span className="text-xs text-gray-500 italic">
                            Optional information to enhance your profile
                        </span>
                    </div>

                    {/* Additional Details Section */}
                    {showDetails && (
                        <div className="mt-2 mb-8 space-y-6 border border-blue-100 rounded-lg p-6 bg-blue-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-gray-700">Website</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-md border border-r-0 border-gray-300">
                                            https://
                                        </span>
                                        <input
                                            type="text"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            className="border border-gray-300 rounded-r-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                            placeholder="www.example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center mb-4">
                                    <MapPin className="w-5 h-5 text-blue-700 mr-2" />
                                    <h3 className="text-md font-semibold text-gray-800">Additional Location Information</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-gray-700">Street Address</label>
                                        <input
                                            type="text"
                                            value={streetAddress}
                                            onChange={(e) => setStreetAddress(e.target.value)}
                                            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                            placeholder="123 Main St"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block text-gray-700">City</label>
                                            <input
                                                type="text"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                                placeholder="City"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block text-gray-700">ZIP / Postal Code</label>
                                            <input
                                                type="text"
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                                placeholder="Postal Code"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Terms and Agreement */}
                    <div className="mt-6 bg-gray-50 p-4 border border-gray-200 rounded-lg">
                        <label className="flex items-start space-x-3 text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreedToPolicy}
                                onChange={() => setAgreedToPolicy(!agreedToPolicy)}
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                required
                            />
                            <div>
                                <span className="text-sm block">
                                    I agree to the <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a> <span className="text-red-500">*</span>
                                </span>
                                <span className="text-xs text-gray-500 block mt-1">
                                    Your information will be used in accordance with our privacy policy
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Error message */}
                    {formError && (
                        <div className="mt-4 text-red-600 text-sm font-medium bg-red-50 p-3 border border-red-100 rounded-md flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {formError}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
                        <Button 
                            onClick={handleBack} 
                            variant="outline"
                            className="px-4 py-2.5 border border-gray-300 rounded-md flex items-center space-x-2 hover:bg-gray-50 font-medium text-gray-700 shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> 
                            <span>Back</span>
                        </Button>
                        
                        <Button 
                            onClick={handleSubmit} 
                            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-md flex items-center space-x-2 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            disabled={!organizationName.trim() || !country || !stateProvince.trim() || !agreedToPolicy}
                        >
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrganizationSetup;