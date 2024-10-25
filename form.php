<?php
header('Content-Type: application/json'); // Specify JSON response
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate inputs
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Email variables
    $to = "shekharbhattaa@gmail.com"; 
    $subject = "New Message from Contact Form";
    $body = "Name: $name\nEmail: $email\nMessage:\n$message";
    $headers = "From: webmaster@shekharbhatt.com.np\r\n"; // Replace with an email on your domain
    $headers .= "Reply-To: $email\r\n";

    // Check if mail function works
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["status" => "success", "message" => "Message sent successfully!"]);
    } else {
        // Log error and respond with a failure message
        error_log("Mail sending failed for form submission to $to");
        echo json_encode(["status" => "error", "message" => "Failed to send message. Please try again later."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
