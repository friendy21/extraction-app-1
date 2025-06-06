"use client";

export default function EmailPreview() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sample Email Before Anonymization</h3>
      <div className="bg-gray-50 p-4 rounded border border-gray-200">
        <div className="space-y-2">
          <div>
            <span className="font-semibold">From:</span>{" "}
            <span className="text-blue-600">John Smith</span>{" "}
            <span className="text-gray-500">&lt;john.smith@company.com&gt;</span>
          </div>
          <div>
            <span className="font-semibold">To:</span>{" "}
            <span className="text-blue-600">Sarah Williams</span>{" "}
            <span className="text-gray-500">&lt;sarah.williams@company.com&gt;</span>
          </div>
          <div>
            <span className="font-semibold">Subject:</span> Project Update - Q3 Roadmap
          </div>
          <div className="pt-2 border-t border-gray-200 mt-2">
            <p>Hi Sarah,</p>
            <p className="mt-2">
              I wanted to follow up on our discussion yesterday about the Q3 roadmap. 
              <span className="text-blue-600"> David </span> 
              mentioned that we need to prioritize the mobile app features, but I think we should focus on the API improvements first.
            </p>
            <p className="mt-2">
              Let's discuss this with 
              <span className="text-blue-600"> Michael </span> and 
              <span className="text-blue-600"> Emma </span> 
              during tomorrow's meeting.
            </p>
            <p className="mt-2">Thanks,</p>
            <p>John</p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium">Same Email After Anonymization</h3>
      <div className="bg-gray-50 p-4 rounded border border-gray-200">
        <div className="space-y-2">
          <div>
            <span className="font-semibold">From:</span>{" "}
            <span className="text-green-600">User1024</span>{" "}
            <span className="text-gray-500">&lt;user1024@anonymous.glynac&gt;</span>
          </div>
          <div>
            <span className="font-semibold">To:</span>{" "}
            <span className="text-green-600">User1036</span>{" "}
            <span className="text-gray-500">&lt;user1036@anonymous.glynac&gt;</span>
          </div>
          <div>
            <span className="font-semibold">Subject:</span> Project Update - Q3 Roadmap
          </div>
          <div className="pt-2 border-t border-gray-200 mt-2">
            <p>Hi <span className="text-green-600">User1036</span>,</p>
            <p className="mt-2">
              I wanted to follow up on our discussion yesterday about the Q3 roadmap. 
              <span className="text-green-600"> User1042 </span> 
              mentioned that we need to prioritize the mobile app features, but I think we should focus on the API improvements first.
            </p>
            <p className="mt-2">
              Let's discuss this with 
              <span className="text-green-600"> User1029 </span> and 
              <span className="text-green-600"> User1045 </span> 
              during tomorrow's meeting.
            </p>
            <p className="mt-2">Thanks,</p>
            <p><span className="text-green-600">User1024</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}