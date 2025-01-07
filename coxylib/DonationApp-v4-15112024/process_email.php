<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get email from form submission
    $email = $_POST['email'];

    // Validate email
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Save email to a file or database (for now, we will write to a file)
        file_put_contents('emails.txt', $email . PHP_EOL, FILE_APPEND);

        // Send an email notification to the inbox
        $to = 'rmambeda@gmail.com';
        $subject = 'New Donor Email';
        $message = "A new email has been submitted: $email";
        mail($to, $subject, $message);

        // Respond with JSON success message
        echo json_encode(['status' => 'success', 'message' => 'Thank you for your submission!']);
    } else {
        // Respond with JSON error message
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address!']);
    }
}
?>

