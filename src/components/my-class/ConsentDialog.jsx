"use client";

import React, { useState, useEffect } from "react";
import { Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConsentDialog = ({ onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 overflow-hidden transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dlfn3vcjp/image/upload/v1752779537/20250718_0039_Whimsical_Crayon_Zoo_simple_compose_01k0cwj5kzf8ktmhg2enrmfeky_2_ns5qkx.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/50 to-purple-50/30 backdrop-blur-lg"></div>

      <Card className={`w-full scale-75 max-w-3xl mx-auto relative z-10 shadow-2xl border-0 bg-white/40 backdrop-blur-2xl rounded-3xl transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 scale-75 opacity-100' : 'translate-y-8 scale-50 opacity-0'
      }`}>
        <CardHeader className="text-center pb-6 border-b border-white/20">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Instructions for Parents/Caregivers
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Main Instructions */}
          <div className="space-y-6">
            <div className="p-6 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/20">
              <p className="text-lg text-gray-800 leading-relaxed">
                Please read each question carefully and select the response that best describes your 
                child's behavior over the <strong>past six months</strong>. If you are unsure, consider what you observe 
                most often. Your honest and accurate responses are vital for the effectiveness of this 
                screening tool.
              </p>
            </div>

            {/* Response Scale */}
            <div className="p-6 bg-blue-50/80 backdrop-blur-xl rounded-2xl border border-blue-200/50">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  ?
                </span>
                Response Scale:
              </h3>
              
              <div className="space-y-3 ml-11">
                <div className="flex items-start space-x-3">
                  <span className="w-8 h-8 min-w-8 min-h-8 bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    0
                  </span>
                  <div>
                    <span className="font-semibold text-gray-800">Never:</span>
                    <span className="text-gray-700 ml-2">The behavior is never observed.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-8 h-8 min-w-8 min-h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-gray-800">Rarely:</span>
                    <span className="text-gray-700 ml-2">The behavior is observed occasionally, but not often.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-8 h-8 min-w-8 min-h-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-gray-800">Sometimes:</span>
                    <span className="text-gray-700 ml-2">The behavior is observed with some regularity.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-8 h-8 min-w-8 min-h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-gray-800">Often:</span>
                    <span className="text-gray-700 ml-2">The behavior is observed frequently or consistently.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-white/20">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex items-center space-x-2 px-6 py-3 bg-white/50 hover:bg-white/70 border-white/30 backdrop-blur-sm rounded-xl transition-all duration-200"
            >
              <span>Cancel</span>
            </Button>

            <Button
              onClick={onConfirm}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-200"
            >
              <Check className="w-4 h-4" />
              <span>I Understand, Continue</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentDialog;
