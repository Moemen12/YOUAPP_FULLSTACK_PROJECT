export default function DesktopMessage(): JSX.Element {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Mobile Only Application</h1>
        <p className="text-gray-600">
          Please access this application from a mobile device.
        </p>
      </div>
    </div>
  );
}
