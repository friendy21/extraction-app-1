"use client";

export default function ChatPreview() {
  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-medium">Sample Chat Before Anonymization</h3>
      <div className="bg-gray-50 p-4 rounded border border-gray-200">
        <div className="space-y-4">
          <div className="flex">
            <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
              <div className="text-sm text-blue-700 font-medium mb-1">Robert Johnson</div>
              <p>Have you reviewed the design proposal from the marketing team?</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="bg-green-100 rounded-lg p-3 max-w-[80%]">
              <div className="text-sm text-green-700 font-medium mb-1">Jane Doe</div>
              <p>Yes, I've looked at it. I think we need to discuss it with Emily before proceeding.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
              <div className="text-sm text-blue-700 font-medium mb-1">Robert Johnson</div>
              <p>Good idea. I'll set up a meeting with Emily and the team for tomorrow.</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium">Same Chat After Anonymization</h3>
      <div className="bg-gray-50 p-4 rounded border border-gray-200">
        <div className="space-y-4">
          <div className="flex">
            <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
              <div className="text-sm text-blue-700 font-medium mb-1">User1052</div>
              <p>Have you reviewed the design proposal from the marketing team?</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="bg-green-100 rounded-lg p-3 max-w-[80%]">
              <div className="text-sm text-green-700 font-medium mb-1">User1041</div>
              <p>Yes, I've looked at it. I think we need to discuss it with User1038 before proceeding.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
              <div className="text-sm text-blue-700 font-medium mb-1">User1052</div>
              <p>Good idea. I'll set up a meeting with User1038 and the team for tomorrow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}