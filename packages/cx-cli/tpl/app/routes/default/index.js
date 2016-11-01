import {HtmlElement} from 'cx/ui/HtmlElement';
import {Link} from 'cx/ui/nav/Link';

export default <cx>
    <h3>Success</h3>
    <p>Your app is now running.</p>
    <p>Checklist:</p>
    <ul>
        <li><Link href="~/about">Routing</Link></li>
        <li class="green-item">CSS</li>
        <li>HMR</li>
    </ul>
</cx>
