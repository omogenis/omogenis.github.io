import React from "react";


function Contacts() {
  return (
	<div className="pt-2 border-t dark:border-gray-700" bis_skin_checked="1">
		<div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row" bis_skin_checked="1">
			<img src="https://miltykh.com/assets/ideal-img/avatar.329e268.1000.jpg" alt="" className="self-center flex-shrink-5 w-48 h-48 border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-700" />
			<div className="flex flex-col" bis_skin_checked="1">
				<h4 className="text-3xl font-bold">Ο Ηλίας Μιλτιάδου</h4>
				<p className="dark:text-gray-800"></p>
        <p className="dark:text-gray-800">O φοιτητής Ιατρικής και ταυτόχρονα της Φιλολογίας. Η ερευνητική μου εμπειρία στον τομέα της ανατομίας μου έχει προσφέρει μια ολοκληρωμένη κατανόηση του ανθρώπινου σώματος, ενώ το υπόβαθρό μου στη φιλολογία έχει βελτιώσει την προσοχή μου στη λεπτομέρεια και τις επικοινωνιακές μου δεξιότητες. Κατά τη διάρκεια της φοίτησής μου στην Ιατρική Σχολή, διεξάγω έρευνα σχετικά με την ανατομία του ανθρώπινου σώματος, εστιάζοντας συγκεκριμένα στο κυκλοφορικό σύστημα. Έχω παρουσιάσει τα ευρήματά μου σε διάφορα συνέδρια σε όλη την Ευρώπη και είχα την τιμή να λάβω βραβεία για το έργο μου. </p>
                <a className="button button--primary button--lg" href="http://www.miltykh.com/"> Μάθετε περισσότερα  </a>
			</div>
		</div>
    </div>
  );
}



export default function Home() {
  return (
    <span>
      <Contacts />
    </span>
  );
}